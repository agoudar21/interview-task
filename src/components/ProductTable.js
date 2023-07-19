import React, { useEffect, useState } from "react";
import "./ProductTable.css";
const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from APIs endpoints
        const branch1Response = await fetch("./apis/branch1.json");
        const branch2Response = await fetch("./apis/branch2.json");
        const branch3Response = await fetch("./apis/branch3.json");

        // Extract JSON data from responses
        const branch1Data = await branch1Response.json();
        const branch2Data = await branch2Response.json();
        const branch3Data = await branch3Response.json();

        // Merge the products of all branches
        const mergedProducts = mergeProductsData([
          branch1Data.products,
          branch2Data.products,
          branch3Data.products,
        ]);

        // Sort products array alphabetically by product name
        mergedProducts.sort((a, b) => a.name.localeCompare(b.name));

        // Update state variables
        setProducts(mergedProducts);
        setFilteredProducts(mergedProducts);
      } catch (error) {
        console.error("Unable to fecth the data", error);
      }
    };

    fetchData();
  }, []);

  //function to combine the products with the same ID and their over all 3 branches revenue.
  const mergeProductsData = (branchesProducts) => {
    const mergedProductsMap = {};

    branchesProducts.forEach((branchProducts) => {
      branchProducts.forEach((product) => {
        const { id, name, unitPrice, sold } = product;

        if (mergedProductsMap[id]) {
          mergedProductsMap[id].sold += sold;
          mergedProductsMap[id].revenue += unitPrice * sold;
        } else {
          mergedProductsMap[id] = {
            id,
            name,
            unitPrice,
            sold,
            revenue: unitPrice * sold,
          };
        }
      });
    });

    return Object.values(mergedProductsMap);
  };

  useEffect(() => {
    // Calculate total revenue
    const totalRevenue = filteredProducts.reduce(
      (total, product) => total + product.revenue,
      0
    );
    setTotalRevenue(totalRevenue);
  }, [filteredProducts]);

  const handleFilterChange = (event) => {
    const { value } = event.target;
    setFilterText(value);

    if (value.trim() === "") {
      setFilteredProducts(products);
      return;
    }

    // Filter products based on filterText
    const filtered = products.filter(
      (product) => product.name.toLowerCase() === value.toLowerCase()
      // product.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="product-table-container">
      <input
        type="text"
        className="search-input"
        value={filterText}
        onChange={handleFilterChange}
        placeholder="Search products..."
      />
      <table className="product-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.revenue}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total Revenue:</td>
            <td>{totalRevenue}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ProductTable;
