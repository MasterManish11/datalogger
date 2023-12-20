// export const revalidate = 0;
// export const dynamic = 'force-dynamic';
async function getData() {
    const url = `${process.env.NEXT_PUBLIC_DOMAIN_NAME}api/dashboard`
    const res = await fetch(url,{
        catch: 'no-store',
        next: { revalidate: 5 },
      })
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
   
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
  }

const APITest = async() => {
    const data = await getData()

  return (
    <div>
      {
        data && data.map((d,i)=><h1 key={i} >{d.Speed}</h1>)
      }
    </div>
  )
}

export default APITest
