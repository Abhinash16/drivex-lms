<template>
  <div>
    <v-btn @click="copy">copy</v-btn>
    {{ filtered }}
  </div>
</template>

<script>
import assets from "./assetmasterscx.json";
export default {
  data() {
    return {
      filtered: [],
      assets: assets,
    };
  },
  mounted() {
    this.assets.forEach((x) => {
      let imageList = x.imageList;
      let availableColors = x.availableColors;
      delete x.price;
      delete x.imageList;
      delete x.availableColors;
      let payload = {
        colors: availableColors.filter((entry) => entry.hexValue[0] !== ""),
        images: imageList
          .filter((entry) => entry.url !== "") // Filter out entries with empty URLs
          .map((entry) => entry.url),
        heroImage: imageList[0].url,
        modelId: x.model.toLowerCase().replace(/ /g, "-"),
        ...x,
      };
      this.filtered.push({
        ...payload,
      });
    });
  },
  methods: {
    copy() {
      console.log(this.filtered);
    },
  },
};
</script>

<style></style>
