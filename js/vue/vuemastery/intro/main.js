Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">
      <div>
        <img :src="image" v-bind:alt="altText" class="product-image">
      </div>

      <div class="product-info">
        <h1>{{ title }}</h1>

        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>

        <div class="color-box"
             v-for="(variant, index) in variants"
             :key="variant.variantId"
             :style="{ backgroundColor: variant.variantColor }"
             @mouseover="updateProduct(index)"
             >
        </div>

        <p v-if="inventory > 10">In stock</p>
        <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out !</p>
        <p v-else>Out of stock</p>

        <button v-on:click="changeCartValue(1)"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }"
                >
          Add to cart
        </button>
        <button v-on:click="changeCartValue(-1)"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }"
                >
          Remove from cart
        </button>
        <div class="cart">
          <p>Cart({{ cart }})</p>

          <p>Shipping: {{ shipping }}</p>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
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
    }
  },
  methods: {
    changeCartValue(val) {
      this.cart += val;
    },
    updateProduct(index) {
      this.selectedVariant = index
    }
  },
  computed: {
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    shipping() {
      if (this.premium) {
        return "Free";
      } else {
        return 2.99;
      }
    },
    title() {
      return this.brand + ' ' + this.product;
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    premium: true
  }
})
