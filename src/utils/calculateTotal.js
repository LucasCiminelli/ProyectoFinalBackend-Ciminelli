export const calculateTotal = (products) => {
  const totalAmount = products.reduce((total, product) => {
    console.log(`Calculating total for product: ${product.product.title}`);
    return total + product.quantity * product.product.price;
    console.log(`Product total: ${productTotal}`);
  }, 0);

  console.log(`Total amount calculated: ${totalAmount}`);
  return totalAmount;
};
