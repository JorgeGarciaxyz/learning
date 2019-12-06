var app = new Vue({
  el: '#app',
  data: {
    altText: "A pair of socks",
    cart: 0,
    description: 'Some nice socks!',
    details: ["80% cotton", "20% skill", "Power of will"],
    image: "./assets/vmSocks-green.jpg",
    inStock: true,
    inventory: 10,
    product: 'Socks',
    variants: [
      {
        variantId: 2234,
        variantColor: "green",
        variantImage: "./assets/vmSocks-green.jpg"
      },
      {
        variantId: 2235,
        variantColor: "blue",
        variantImage: "./assets/vmSocks-blue.jpg"
      }
    ]
  },
  methods: {
    changeCartValue(val) {
      this.cart += val;
    },
    updateProduct(variantImage) {
      this.image = variantImage;
    }
  }
})
