async function myMap<T, U> (arr : T[], callback : (item : T, index : number, array : Array<T>) => Promise<U>){
    const result : Array<U> = [];
    for(let i = 0; i<arr.length; i++){
        result.push(await callback(arr[i], i, arr));
    }
    return result;
}