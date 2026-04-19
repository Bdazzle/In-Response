
export type GridConfig = {
    columns: number,
    scale: number,
    needsScroll: boolean,
    scrollHeight?: number
}

/**
 * start out as 4x7 grid. if > 28, need an additional col and scale by -20%, which means next max is cols(5)+1 + rows(8)+1 (12 new btns, rows+cols-1)
 * @param totalItems 
 * @returns 
 */
const getOptimalGridConfig = (totalItems : number) : GridConfig => {
  // Configuration
  const BASE_COLUMNS = 4;
  const BASE_ROWS = 7;
  const BASE_CELLS = BASE_COLUMNS * BASE_ROWS; // 28
  const SCALE_REDUCTION = 0.2; // 20% reduction when adding column
  const MIN_SCALE = 0.4; // Don't scale below 40%
  const MAX_COLUMNS = 8; // Maximum columns before using scroll
  
  // Calculate needed capacity
  let optimalColumns = BASE_COLUMNS;
  let optimalScale = 1;
  
  if (totalItems > BASE_CELLS) {
    // How many additional "chunks" of 28 items do we need?
    const chunks = Math.ceil((totalItems - BASE_CELLS) / BASE_CELLS);
    
    // Each chunk adds 1 column (with diminishing returns)
    optimalColumns = Math.min(
      BASE_COLUMNS + chunks,
      MAX_COLUMNS
    );
    
    // Scale reduces by 20% for each added column
    const scaleMultiplier = 1 - ((optimalColumns - BASE_COLUMNS) * SCALE_REDUCTION);
    optimalScale = Math.max(MIN_SCALE, scaleMultiplier);
    
    // Final sanity check: with new columns and scale, do we fit?
    const effectiveCapacity = optimalColumns * BASE_ROWS;
    if (totalItems > effectiveCapacity && optimalColumns === MAX_COLUMNS) {
      // Need scrollView because we hit max columns
      return {
        columns: optimalColumns,
        scale: optimalScale,
        needsScroll: true,
        scrollHeight: Math.ceil(totalItems / optimalColumns) * 50 * optimalScale
      };
    }
  }
  
  return {
    columns: optimalColumns,
    scale: optimalScale,
    needsScroll: false
  };
};

export default getOptimalGridConfig