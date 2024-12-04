const { G4F } = require('g4f');
const amazonScraper = require('amazon-buddy');
const g4f = new G4F();

async function getRequiredProducts(needQuery) {
    const systemMessage = {
        role: "system",
        content: "You are an AI assistant that provides a list of as many products required to fulfill a specific need. Do not include any additional text or explanations, only an array of product names."
    };

    const userMessage = {
        role: "user",
        // content: `Output an array of all possible products required for ${needQuery}.`
        // content: `I have a requirement: '${needQuery}'. Please provide a single JSON array of the maximum number of products required to fulfill this requirement. Each product should be a string enclosed in double quotes, and the response should strictly contain only the array, with no other text. `
        content: `I have a requirement: '${needQuery}'. Please provide a list of concise, complete product names, separated by commas, with no numbers, or additional text in the response. Each product name should be clear and unambiguous, but not excessively long or detailed`

    };

    const messages = [systemMessage, userMessage];

    try {
        const response = await g4f.chatCompletion(messages);
        const productsArray = parseResponseToList(response);
        console.log(response);

        console.log(productsArray);
        console.log(typeof productsArray);

        return productsArray;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return [];
    }
}

function parseResponseToList(response) {
    const listItems = response.split(/[\n•,]/).map(item => item.trim()).filter(item => item.length > 0);
    return listItems;
}

async function getProductsFromAmazon(selectedProducts) {
    const results = {};
    for (const product of selectedProducts) {
        const products = await amazonScraper.products({
            keyword: product,
            number: 5,
            rating: [4, 5],
            country: 'IN'
        });
        results[product] = products.result;
    }
    // console.log(results);

    // refine results -----------------------------------------------
    const filteredProducts = {};

    Object.keys(results).forEach((key) => {
        // Filter out products where the title contains the word "Sponsored"
        const nonSponsoredProducts = results[key].filter(
            (product) => !product.title.toLowerCase().includes('sponsored')
        );

        // Keep only the first 4 products
        filteredProducts[key] = nonSponsoredProducts.slice(0, 8);
    });

    console.log(filteredProducts);


    // ---------------------------------------------------------------

    return filteredProducts;
}

module.exports = {
    getRequiredProducts,
    getProductsFromAmazon
};
