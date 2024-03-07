type Transform3dName =
    | "translateX"
    | "translateY"
    | "translateZ"
    | "translate"
    | "scale"
    | "scaleX"
    | "scaleY"
    | "skewX"
    | "skewY"
    | "rotateZ"
    | "rotate"
    | "perspective"
    | "rotateX"
    | "rotateY"
    | "rotateZ"
    | "matrix";

export type Matrix4 = readonly [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];

type Matrix<N extends number> = Repeat<[number, number, number, number], N>

type Repeat<T, C extends number, Result extends any[] = [], Counter extends any[] = []> =
    Counter['length'] extends C ?
    Result :
    Repeat<T, C, [...Result, T], [...Counter, number]>

// type Vec3 = [number, number, number];
// type Vec2 = [number, number]
type Vec<N extends number> = Repeat<number, N>

type Transformations = {
    [Name in Transform3dName]: Name extends "matrix"
    ? Matrix4
    : Name extends "translate"
    ? Vec<3> | Vec<2>
    : number;
};

type test = Pick<Transformations, "rotate">;

type Transform3d =
    | Pick<Transformations, "rotateX">
    | Pick<Transformations, "rotateY">
    | Pick<Transformations, "rotateZ">
    | Pick<Transformations, "rotate">
    | Pick<Transformations, "translateX">
    | Pick<Transformations, "translateY">
    | Pick<Transformations, "translateZ">
    | Pick<Transformations, "translate">
    | Pick<Transformations, "scale">
    | Pick<Transformations, "scaleX">
    | Pick<Transformations, "scaleY">
    | Pick<Transformations, "skewX">
    | Pick<Transformations, "skewY">
    | Pick<Transformations, "perspective">
    | Pick<Transformations, "matrix">;

// export type Transforms3d = Transform3d[];



// type Matrix = number[]

export const multiply4 = (a: Matrix4, b: Matrix4): Matrix4 => {
    const result = new Array(16).fill(0);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            result[i * 4 + j] =
                a[i * 4] * b[j] +
                a[i * 4 + 1] * b[j + 4] +
                a[i * 4 + 2] * b[j + 8] +
                a[i * 4 + 3] * b[j + 12];
        }
    }
    return result as unknown as Matrix4;
};



export const translate = (x: number, y: number, z: number): Matrix4 => {
    return [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1];
};

const scale = (sx: number, sy: number, sz: number): Matrix4 => {
    return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
};


export const skewX = (s: number): Matrix4 => {
    return [1, 0, 0, 0, Math.tan(s), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};

export const skewY = (s: number): Matrix4 => {
    return [1, Math.tan(s), 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};

export const perspective = (p: number): Matrix4 => {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -1 / p, 1];
};

const rotatedUnitSinCos = (
    axisVec: Vec<3>,
    sinAngle: number,
    cosAngle: number
): Matrix4 => {
    const [x, y, z] = axisVec;
    const c = cosAngle;
    const s = sinAngle;
    const t = 1 - c;
    return [
        t * x * x + c,
        t * x * y - s * z,
        t * x * z + s * y,
        0,
        t * x * y + s * z,
        t * y * y + c,
        t * y * z - s * x,
        0,
        t * x * z - s * y,
        t * y * z + s * x,
        t * z * z + c,
        0,
        0,
        0,
        0,
        1,
    ];
};

//   type Vec<N extends number> = Repeat<number, N>;



const normalizeVec = (vec: Vec<3>): Vec<3> => {
    const [x, y, z] = vec;
    const length = Math.sqrt(x * x + y * y + z * z);
    // Check for zero length to avoid division by zero
    if (length === 0) {
        return [0, 0, 0];
    }
    return [x / length, y / length, z / length];
};

export const rotate = (axis: Vec<3>, value: number) => {
    return rotatedUnitSinCos(
        normalizeVec(axis),
        Math.sin(value),
        Math.cos(value)
    );
};

export const identity4: Matrix4 = [
    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
];

const exhaustiveCheck = (a: never): never => {
    throw new Error(`Unexhaustive handling for ${a}`);
};

// type RotateTransformations = {

// }
type RotationNames = 'rotate' | "rotateX" | "rotateY" | "rotateZ"
type RotateTransforms = {
    // [Name in RotationTypes] : Matrix<4>
    // [key: string]: number
    [Name in Transform3dName]: Name extends "matrix"
    ? Matrix<4>
    : Name extends "translate"
    ? Vec<3> | Vec<2>
    : number;
}

export const multiplyMatrix = (a: number[], b: number[]) => {
    const result = new Array(16).fill(0);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            result[i * 4 + j] =
                a[i * 4] * b[j] +
                a[i * 4 + 1] * b[j + 4] +
                a[i * 4 + 2] * b[j + 8] +
                a[i * 4 + 3] * b[j + 12];
        }
    }
    return result as unknown as number[];
};

const rotateShape = (axis: Vec<3>, value: number) => {
    const normalizedVector = () => {
        const [x, y, z] = axis
        const length = Math.sqrt(x * x + y * y + z * z);
        // Check for zero length to avoid division by zero
        if (length === 0) {
            return [0, 0, 0];
        }
        return [x / length, y / length, z / length];
    }
    const sinAngle = Math.sin(value);
    const cosAngle = Math.cos(value);
    const t = 1 - cosAngle;
    const [x, y, z] = normalizedVector()
    return [
        t * x * x + cosAngle,
        t * x * y - sinAngle * z,
        t * x * z + sinAngle * y,
        0,
        t * x * y + sinAngle * z,
        t * y * y + cosAngle,
        t * y * z - sinAngle * x,
        0,
        t * x * z - sinAngle * y,
        t * y * z + sinAngle * x,
        t * z * z + cosAngle,
        0,
        0,
        0,
        0,
        1,
    ];
}

export const rotationAnimation = <N extends number>(transforms: any[], sides: number) => {
   const matrixTransforms = transforms.reduce((acc: Matrix<4>, val: RotateTransforms) => {
        const matrixArr = Array.from(acc).flat(1) as number[];
        const key = Object.keys(val)[0] as string;
        const transform = val;
        if (key === "rotateX") {
            const value = transform[key];
            return multiplyMatrix(matrixArr, rotateShape([1, 0, 0], value));
        }
        if (key === "rotateY") {
            const value = transform[key];
            return multiplyMatrix(matrixArr, rotateShape([0, 1, 0], value));
        }
        if (key === "rotate" || key === "rotateZ") {
            const value = transform[key];
            return multiplyMatrix(matrixArr, rotateShape([0, 0, 1], value));
        }
    })
    return matrixTransforms
}


export const processTransform3d = (transforms: Transform3d[]) => {
    return transforms.reduce((acc: Matrix4, val: Transform3d) => {
        const key = Object.keys(val)[0] as Transform3dName;
        const transform = val as Pick<Transformations, typeof key>;
        if (key === "translateX") {
            const value = transform[key];
            return multiply4(acc, translate(value, 0, 0));
        }
        if (key === "translate") {
            const [x, y, z = 0] = transform[key];
            return multiply4(acc, translate(x, y, z));
        }
        if (key === "translateY") {
            const value = transform[key];
            return multiply4(acc, translate(0, value, 0));
        }
        if (key === "translateZ") {
            const value = transform[key];
            return multiply4(acc, translate(0, 0, value));
        }
        if (key === "scale") {
            const value = transform[key];
            return multiply4(acc, scale(value, value, 1));
        }
        if (key === "scaleX") {
            const value = transform[key];
            return multiply4(acc, scale(value, 1, 1));
        }
        if (key === "scaleY") {
            const value = transform[key];
            return multiply4(acc, scale(1, value, 1));
        }
        if (key === "skewX") {
            const value = transform[key];
            return multiply4(acc, skewX(value));
        }
        if (key === "skewY") {
            const value = transform[key];
            return multiply4(acc, skewY(value));
        }
        if (key === "rotateX") {
            const value = transform[key];
            return multiply4(acc, rotate([1, 0, 0], value));
        }
        if (key === "rotateY") {
            const value = transform[key];
            return multiply4(acc, rotate([0, 1, 0], value));
        }
        if (key === "perspective") {
            const value = transform[key];
            return multiply4(acc, perspective(value));
        }
        if (key === "rotate" || key === "rotateZ") {
            const value = transform[key];
            return multiply4(acc, rotate([0, 0, 1], value));
        }
        if (key === "matrix") {
            const value = transform[key];
            return multiply4(acc, value);
        }
        return exhaustiveCheck(key);
    }, identity4);

};

