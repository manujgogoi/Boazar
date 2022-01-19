/**
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import axiosInstance from '../../services/Axios';
import {IMAGE_URL} from '../../utils/urls';

const ProductImage = ({imageUrl}) => {
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let unmounted = false;
    axiosInstance
      .get(imageUrl)
      .then(res => {
        if (!unmounted) {
          setImage(res.data);
        }
      })
      .catch(error => console.log('Get image Error : ', error))
      .finally(() => setLoading(false));

    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <View>
      {loading ? (
        <Text>Loading image...</Text>
      ) : (
        <Image style={{width: 100, height: 100}} source={{uri: image.image}} />
      )}
    </View>
  );
};

const ProductImages = ({imageUrls}) => {
  return (
    <ScrollView>
      {imageUrls.map(url => (
        <ProductImage key={url} imageUrl={url} />
      ))}
    </ScrollView>
  );
};

const ProductDetailsScreen = ({navigation, route}) => {
  const {productUrl} = route.params;
  const [product, setProduct] = useState('');
  const [images, setImages] = useState([]);
  const [productLoading, setProductLoading] = useState(false);
  const [productCategory, setProductCategory] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(false);

  // Load product
  // ======================================================================
  useEffect(() => {
    let unmounted = false;
    setProductLoading(true);
    axiosInstance
      .get(productUrl)
      .then(res => {
        if (!unmounted) {
          setProduct(res.data);

          // Get product images
          // ==============================================================
          axiosInstance
            .get(`${IMAGE_URL}get_product_images/`, {
              params: {
                product_id: 40,
              },
            })
            .then(res => setImages(res.data))
            .catch(error =>
              console.log('Image Loading error : ', error.message),
            );
        }
      })
      .catch(error => console.log('Product loading error : ', error))
      .finally(() => setProductLoading(false));
    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <View>
      <View>
        <Text>{product ? product.title : 'No product'}</Text>
      </View>
      <View>
        {product && images.length > 0 ? (
          images.map(image => (
            <Image
              key={image.url}
              style={{width: 100, height: 100}}
              source={{uri: image.image}}
            />
          ))
        ) : (
          <Text>No images</Text>
        )}
      </View>
    </View>
  );
};

export default ProductDetailsScreen;
