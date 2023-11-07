import ProductService from "../services/product.service.js";

const productService = new ProductService();


export const getProducts = async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;

    const modelLimit = limit ? parseInt(limit, 10) : 10;
    const modelPage = page ? parseInt(page, 10) : 1;
    const modelQuery = query ? JSON.parse(query) : {};

    let sortOptions = {};

    if (sort === "asc") {
      sortOptions = { price: 1 };
    } else if (sort === "des") {
      sortOptions = { price: -1 };
    }

    const products = await productService.getProducts(modelQuery, {
      limit: modelLimit,
      page: modelPage,
      sort: sortOptions,
    });

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send("Error");
  }
};

export const getProductsById = async (req, res) => {
  const productId = req.params.pid;
  const product = await productService.getProductsById(productId);

  if (product === undefined) {
    return res.status(404).send();
  }

  res.send(product);
};

export const createProduct = async (req, res) => {
  try {
    const product = req.body;

    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.price ||
      !product.stock ||
      !product.category ||
      !product.thumbnails
    ) {
      return res.status(400).send("Faltan completar campos obligatorios");
    }

    await productService.addProduct({ ...product, status: true });
    const products = await productService.getProducts();
    req.context.socketServer.emit("update_products", products);

    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).send("Producto no agregado");
  }
};

export const updateProduct = async (req, res) => {
  const id = req.params.pid;
  const prodActualizado = req.body;

  const updatedProduct = await productService.updateProduct(
    id,
    prodActualizado
  );
  const products = await productService.getProducts();
  req.context.socketServer.emit("update_products", products);

  if (updatedProduct) {
    res.status(200).send(updatedProduct);
  } else {
    res.status(404).send("producto no encontrado");
  }
};

export const deleteProduct = async (req, res) => {
  const prodId = req.params.pid;

  const deletedProduct = await productService.deleteProduct(prodId);
  const products = await productService.getProducts();
  req.context.socketServer.emit("update_products", products);

  if (deletedProduct) {
    res.status(200).send(`Producto Eliminado Correctamente.`);
  } else {
    res.status(404).send("Producto no encontrado");
  }
};
