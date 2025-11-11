import { useEffect, useState } from "react";


export function useDebouncedValue<T>(value:T,delay=400){
    const [debounced,setDebounced]=useState(value);
    useEffect(()=>{
        const id=setTimeout(()=>setDebounced(value),delay);
        return ()=>clearTimeout(id);
    },[value,delay]);
    return debounced;
}