/**
 * @format
 * @flow strict-local
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

//=======================================================
// Cart
//=======================================================
export const addToCart = async item => {
  // Get existing products first
  //====================================================
  try {
    const products = await AsyncStorage.getItem('cart');
    if (products !== null) {
      const productsArray = JSON.parse(products);

      const alreadyExists = productsArray.filter(
        obj => obj.id === item.id,
      ).length;

      if (alreadyExists === 0) {
        const updatedProductsArray = productsArray.concat(item);

        // Add to AsyncStorage
        try {
          await AsyncStorage.setItem(
            'cart',
            JSON.stringify(updatedProductsArray),
          );
        } catch (e) {
          console.log('asyncStorage.js->addToCart() update error: ', e);
        }
      } else {
        throw Error('Item already added');
      }
    } else {
      // Add the first product
      // ===============================================
      try {
        await AsyncStorage.setItem('cart', JSON.stringify([item]));
      } catch (e) {
        console.log('asyncStorage.js->adding first product error : ', e);
      }
    }
  } catch (e) {
    console.log('asyncStorage.js->addToCart() error: ', e);
  }
};

export const getCart = async () => {
  try {
    const products = await AsyncStorage.getItem('cart');
    if (products !== null) {
      return JSON.parse(products);
    }
  } catch (e) {
    console.log('asyncStorage.js->getCart() error: ', e);
  }
};

export const removeFromCart = async id => {
  // Get all products from AsyncStorage cart
  // ===================================================
  try {
    const products = await AsyncStorage.getItem('cart');
    if (products !== null) {
      const productsArray = JSON.parse(products);
      const updatedProductsArray = productsArray.filter(
        product => product.id !== id,
      );

      // Add updatedProducts to AsyncStorage
      try {
        await AsyncStorage.setItem(
          'cart',
          JSON.stringify(updatedProductsArray),
        );
      } catch (e) {
        console.log('asyncStorage.js->removeFromCart() update cart error: ', e);
      }
    }
  } catch (e) {
    console.log('asyncStorage.js->removeFromCart() get error: ', e);
  }
};

// Increase Product Quantity
export const increaseCartQuantity = async productId => {
  // Get cart from asyncStorage
  try {
    const products = await AsyncStorage.getItem('cart');
    if (products !== null) {
      const productsArray = JSON.parse(products);

      const updatedProductsArray = productsArray.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        } else {
          return product;
        }
      });

      // Store updated cart to AsyncStorage
      try {
        await AsyncStorage.setItem(
          'cart',
          JSON.stringify(updatedProductsArray),
        );
      } catch (e) {
        console.log(
          'asyncStorage.js->incrementCartQuantity() store error: ',
          e,
        );
      }
    } else {
      console.log('asyncStorage.js->incrementCartQuantity(): Cart is null');
    }
  } catch (e) {
    console.log('asyncStorage.js->incrementCartQuantity() get error: ', e);
  }
};

// Decrement Product Quantity
export const decreaseCartQuantity = async productId => {
  // Get cart from asyncStorage
  try {
    const products = await AsyncStorage.getItem('cart');
    if (products !== null) {
      const productsArray = JSON.parse(products);

      const updatedProductsArray = productsArray.map(product => {
        if (product.id === productId && product.quantity > 1) {
          return {
            ...product,
            quantity: product.quantity - 1,
          };
        } else {
          return product;
        }
      });

      // Store updated cart to AsyncStorage
      try {
        await AsyncStorage.setItem(
          'cart',
          JSON.stringify(updatedProductsArray),
        );
      } catch (e) {
        console.log('asyncStorage.js->decreaseCartQuantity() store error: ', e);
      }
    } else {
      console.log('asyncStorage.js->decreaseCartQuantity(): Cart is null');
    }
  } catch (e) {
    console.log('asyncStorage.js->decreaseCartQuantity() get error: ', e);
  }
};
