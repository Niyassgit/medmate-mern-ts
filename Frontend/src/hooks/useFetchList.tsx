import {useState,useEffect} from 'react'



const useFetchList = <T,>(fetchFn:()=>Promise<T[]>) => {

  const [data,setData]=useState<T[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string | null>(null);

  useEffect(()=>{

    const fetchData=async ()=>{
      try {
        const result=await fetchFn();
        setData(result);
      } catch (error:any) {
        setError(error.message || "Something went wrong")
      }finally{
        setLoading(false);
      }
    }
    fetchData();
  },[fetchFn])


 return {data,loading,error};
  
}

export default useFetchList
