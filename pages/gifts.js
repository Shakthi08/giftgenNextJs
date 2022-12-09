import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [gender, setGender] = useState("Male");
  const [age, setAge] = useState("20");
  const [priceMin, setPriceMin] = useState("10");
  const [priceMax, setPriceMax] = useState("100");
  const [hobbies, setHobbies] = useState("");
  const [loading, setLoading] = useState(false);
  
  
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();

    if(loading){
      return;
    }

    try{
      setLoading(true);
      setResult(null);
      const response = await fetch("/api/generate-gifts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceMin, priceMax, gender, age, hobbies}),
    });
    const data = await response.json();
    setResult(data.result.replaceAll("\n", "<br />"));
    
    }catch(e){
      alert(e);
    }finally{
      setLoading(false);
    }
    
  }

  return (
    <div>
      <Head>
        <title>Gift idea generator</title>
        <link rel="icon" href="/gift_favicon.png" />
      </Head>

      <main className={styles.main}>
        
        <h3>Gift generator</h3>
        
        <form onSubmit={onSubmit}>
          <div className={styles.card}>
            <p className={styles.p}>Fill in this form with the details of the gift receiver and get a number of personalized gift ideas with the given price range ($) </p>
          <p>Other currencies coming soon!!</p>
          </div>
          <label>Gender of the gift receiver</label>
          <select
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="man">Male/Boy</option>
            <option value="woman">Female/Girl</option>
          </select>

          <label>Age</label>
          <input
            type="number"
            min={1}
            max={100}
            name="age"
            placeholder="Enter age of gift receiver"
            value={age}
            onChange={(e) => setAge(Number.parseInt(e.target.value))}
          />

          <label>Starting price ($)</label>
          <input
            type="number"
            min={1}
            name="priceMin"
            placeholder="Enter the minimum price of gift"
            value={priceMin}
            onChange={(e) => setPriceMin(Number.parseInt(e.target.value))}
          />

          <label>Maximum price ($)</label>
          <input
            type="number"
            min={1}
            name="priceMax"
            placeholder="Enter the maximum price of gift"
            value={priceMax}
            onChange={(e) => setPriceMax(Number.parseInt(e.target.value))}
          />

          <label>Hobbies (separate with commas ',')</label>
          <input
            type="text"
            name="hobbies"
            placeholder="Enter the hobbies of the gift receiver"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
          />
          <input type="submit" value="Generate gift ideas" />
        </form>
        

        {loading && (
          <div>
            {/* <h3>Wrapping the best gifts for you...</h3> */}
            <img src="/loader.webp" className={styles.loading}></img> 
          </div>
        )}

        {result && (
          <div className={styles.result} dangerouslySetInnerHTML={{__html: result}}/>
        )}
      </main>
    </div>
  );
}
