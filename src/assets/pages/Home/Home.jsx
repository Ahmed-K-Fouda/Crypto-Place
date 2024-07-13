import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import { CoinContext } from "../../context/CoinContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { allCoin, currency } = useContext(CoinContext);

  const [displayCoin, setDisplayCoin] = useState([]);
  const [displayCount, setDisplayCount] = useState(12);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);

  const inputHandler = function (e) {
    setSearchInput(e.target.value);
    if (e.target.value === "") {
      setDisplayCoin(allCoin);
    }
  };

  const searchHandler = async function (e) {
    e.preventDefault();
    setLoading(true);

    const coins = await allCoin.filter((item) => {
      return item.name.toLowerCase().includes(searchInput.toLowerCase());
    });
    if (!coins) return;

    if (coins.length === 0) {
      alert("the name not match");
      setTimeout(() => {
        setLoading(false);
      }, 0);
      setDisplayCoin(allCoin);
    } else {
      setDisplayCoin(coins);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin]);

  const showMore = () => {
    const additionalItems = 12;
    setDisplayCount((prevCount) => prevCount + additionalItems);
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>
          Largest <br /> Crypto Marketplace
        </h1>
        <p>
          Welcome to the world largest cryptocurrency marketplace. sign up to
          explore more about crypto
        </p>
        <form onSubmit={searchHandler}>
          <input
            onChange={inputHandler}
            type="text"
            value={searchInput}
            placeholder="Search crypto.."
            required
            list="coinlist"
          />

          <datalist id="coinlist">
            {allCoin.map((item, i) => (
              <option key={i} value={item.name} />
            ))}
          </datalist>

          <button type="submit">Search</button>
        </form>
      </div>

      <div className="crypto-table">
        <div className="table-layout">
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p style={{ textAlign: "center" }}>24H Change</p>
          <p className="market-cap">Market Cap</p>
        </div>
        {loading ? (
          <div className="loading">
            <div className="load"></div>
          </div>
        ) : (
          displayCoin.slice(0, displayCount).map((item, i) => (
            <Link to={`/coin/${item.id}`} className="table-layout" key={i}>
              <p>{item.market_cap_rank}</p>
              <div>
                <img src={item.image} alt={item.name} />
                <p>{item.name + " - " + item.symbol}</p>
              </div>
              <p>
                {currency.symbol} {item.current_price.toLocaleString()}
              </p>
              <p
                style={
                  item.price_change_percentage_24h < 0
                    ? { color: "red", textAlign: "center" }
                    : { color: "#00d515", textAlign: "center" }
                }
              >
                {Math.floor(item.price_change_percentage_24h * 100) / 100}
              </p>
              <p className="market-cap">
                {currency.symbol}
                {item.market_cap.toLocaleString()}
              </p>
            </Link>
          ))
        )}
      </div>
      <button onClick={showMore} className="btn_show">
        {displayCount >= 100 ? "No more" : "Show more"}
      </button>
    </div>
  );
}
