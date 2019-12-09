var app = new Vue({
  el: '#app',
  data: {
    altText: "A pair of socks",
    brand: "Vue Mastery",
    cart: 0,
    details: ["80% cotton", "20% skill", "Power of will"],
    inventory: 10,
    product: 'Socks',
    variants: [
      {
        variantId: 2234,
        variantColor: "green",
        variantImage: "./assets/vmSocks-green.jpg",
        variantQuantity: 10
      },
      {
        variantId: 2235,
        variantColor: "blue",
        variantImage: "./assets/vmSocks-blue.jpg",
        variantQuantity: 0
      }
    ],
    selectedVariant: 0
  },
  computed: {
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    title() {
      return this.brand + ' ' + this.product;
    }
  },
  methods: {
    changeCartValue(val) {
      this.cart += val;
    },
    updateProduct(index) {
      this.selectedVariant = index
    }
  }
})
