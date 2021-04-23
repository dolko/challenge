// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace fig {
    function init(): any;
    function fread(path: any, fun: (data: unknown, err: any) => void): any;
    function fwrite(path: any, data: any, fun: (err: any) => void): any;
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace pty {
        function init(): any;
    }
}

export const fread = (path: any) => {
    return new Promise((resolve, reject) => {
        fig.fread(path, (data: unknown, err: any) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

export const fwrite = (path: any, data: unknown) => {
    return new Promise((resolve, reject) => {
        fig.fwrite(path, data, (err: any) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

export const figinit = () => {
    return new Promise((resolve, reject) => {
        fig.pty.init();
    })
}