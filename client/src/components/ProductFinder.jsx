import React, { useState } from "react";
import axios from "axios";
import { Card } from "flowbite-react";

import { FaMagnifyingGlass, FaArrowRight } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";
import { RxExternalLink } from "react-icons/rx";

const ProductFinder = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [topProducts, setTopProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState("");

  const handleQuerySubmit = async () => {
    setLoading(true);
    setError("");
    setProducts([]);
    setTopProducts({});
    try {
      const response = await axios.post(
        "http://localhost:5000/api/generate-products",
        { needQuery: query }
      );
      setProducts(response.data);
    } catch (err) {
      setError("Error generating products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (product) => {
    if (selectedProducts.includes(product)) {
      setSelectedProducts(selectedProducts.filter((item) => item !== product));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
    setTopProducts({});
  };

  const handleScrapeProducts = async () => {
    setScraping(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/scrape-products",
        { selectedProducts }
      );
      setTopProducts(response.data);
    } catch (err) {
      setError("Error scraping top products. Please try again.");
    } finally {
      setScraping(false);
    }
  };

  return (
    <>
      <div className="w-full min-h-screen bg-[#f2f0f0]">
        <div className="container px-60">
          {/* heading and search box */}
          <div className="bg-[#f2f0f0] flex flex-col items-center justify-center gap-8 pt-20">
            <h1 className="text-zinc-900 text-center font-bold text-6xl flex items-center gap-3">
              Product Finder AI <HiSparkles />
            </h1>
            <div className="flex items-center border-2 border-zinc-900 rounded-full overflow-hidden p-1 bg-zinc-50 w-[45vw]">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your need..."
                className="px-4 py-1 rounded-full text-lg focus:outline-none w-full bg-zinc-50"
                required
              />
              <button
                onClick={handleQuerySubmit}
                className="bg-zinc-900 rounded-full flex items-center justify-center p-3 text-xl text-white "
              >
                <FaArrowRight />
              </button>
            </div>
          </div>

          {/* <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-gray-200 border-t-zinc-900"></div>
          </div> */}

          {/* Product list */}
          {loading && (
            <div className="flex justify-center items-center mt-10">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-gray-200 border-t-zinc-900"></div>
            </div>
          )}
          {error && <div className="text-center text-red-500">{error}</div>}
          <div className="flex flex-col items-center w-full  mt-10 ">
            {!loading && products.length > 0 && (
              <div className="bg-white shadow-sm rounded-xl w-full p-4 border border-zinc-300">
                <h2 className="text-xl font-medium text-center border-b border-zinc-300 pb-2 ">
                  Here is everything you might need
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
                  {products.map((product, index) => (
                    <div
                      key={index}
                      className="bg-[#f8f6f6] border border-zinc-300 p-2 flex items-center rounded-lg "
                    >
                      <input
                        type="checkbox"
                        className="mr-2"
                        onChange={() => handleCheckboxChange(product)}
                        checked={selectedProducts.includes(product)}
                      />
                      <span>{product}</span>
                    </div>
                  ))}
                </div>
                <div className="w-full mt-3 flex justify-end">
                  <button
                    onClick={handleScrapeProducts}
                    className="bg-zinc-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 "
                  >
                    Get Top Products <FaArrowRight />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* top products */}
          {scraping && (
            <div className="flex justify-center items-center mt-10">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-gray-200 border-t-zinc-900"></div>
            </div>
          )}
          {error && <div className="text-center text-red-500">{error}</div>}

          {!scraping && Object.keys(topProducts).length > 0 && (
            <div className="mt-16">
              {Object.entries(topProducts).map(
                ([category, products], index) => (
                  <div key={index} className="pb-12">
                    <h3 className="text-3xl font-semibold border-b border-zinc-300 pb-2 mb-3 capitalize">
                      {category}
                    </h3>
                    <div className="grid grid-cols-4 gap-4">
                      {products.map((product, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-lg shadow-sm overflow-hidden p-2 flex flex-col gap-2"
                        >
                          <div className="w-full h-60 rounded-md overflow-hidden flex items-center justify-center p-5 border border-zinc-200">
                            <img
                              src={product.thumbnail}
                              alt=""
                              className="object-contain"
                            />
                          </div>

                          <h4 className="line-clamp-2">{product.title}</h4>
                          <div className="flex items-center justify-between ">
                            <p className="font-semibold text-lg">
                              {product.price
                                ? `${product.price.currency} ${product.price.current_price}`
                                : "Unavailable"}
                            </p>

                            <a
                              href={product.url}
                              className=" text-xs  text-black border border-zinc-800 px-2 py-1 font-normal flex items-center gap-1 rounded-md transition-all hover:bg-zinc-900 hover:text-white"
                            >
                              Amazon
                              <RxExternalLink />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
      <div className="w-full py-3 flex items-center justify-center bg-zinc-900 text-white">
        <h4 className="">© 2024 Product Finder AI. All rights reserved</h4>
      </div>
      {/* ----------------------------------------------------------------- */}

    </>
  );
};

export default ProductFinder;
