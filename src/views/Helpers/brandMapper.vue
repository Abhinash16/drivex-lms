<template>
  <div>
    <v-container>
      <v-checkbox v-model="check" label="Check Through Master"></v-checkbox>
      <v-btn class="ml-2" @click="startMap">Start Map Brand</v-btn>
      <v-btn class="ml-2" @click="startMapAsset">Start Map Asset</v-btn>

      <div class="my-10">
        <div>
          searching through incoming => Found: {{ found }} , Not Found :
          {{ notFound }}
        </div>
        <div><strong>Not Found Data:</strong></div>
        {{ notFoundDataBrand }}
      </div>
      <div>
        <div>
          searching through {{ check ? "assetmaster" : "idfc" }} => Found:
          {{ foundidfc }} , Not Found : {{ notFoundidfc }}
        </div>
        <div><strong>Not Found Data:</strong></div>
        {{ notFoundidfcDataBrand }}
      </div>
    </v-container>
  </div>
</template>

<script>
import brands from "./brands.json";
import idfcassetmasters from "./idfcassetmasters.json";
import incoming from "./incoming.json";
import assetmaster from "./assetmasters.json";

export default {
  data() {
    return {
      assetmaster: assetmaster,
      brands: brands,
      idfcassetmasters: idfcassetmasters,
      incoming: incoming,
      mapped: [],
      found: 0,
      notFound: 0,
      foundDataBrand: [],
      notFoundDataBrand: [],
      foundidfc: 0,
      notFoundidfc: 0,
      foundidfcDataBrand: [],
      notFoundidfcDataBrand: [],
      check: false,
    };
  },
  methods: {
    startMap() {
      incoming.forEach((x) => {
        this.mapped.push({
          make: x.make,
          brandId: x.make + "-bikes",
          assetId:
            x.make +
            "-" +
            x.model +
            "-" +
            String(x.version)
              .replace(/_/g, " ")
              .replace(/ /g, "-")
              .toLocaleLowerCase(),
        });
      });
      if (this.check) {
        this.mapped.forEach((map) => {
          const data = assetmaster.find((asset) => {
            return asset.brandId == map.brandId;
          });
          if (data) {
            if (!this.foundDataBrand.includes(data.brandId)) {
              this.foundDataBrand.push(data.brandId);
              this.found++;
            }
          } else {
            console.log(data);
            if (!this.notFoundDataBrand.includes(map.brandId)) {
              this.notFoundDataBrand.push(map.brandId);
              this.notFound++;
            }
          }
        });

        this.assetmaster.forEach((mm) => {
          const data = this.mapped.find((mpp) => {
            return mpp.brandId == mm.brandId;
          });
          if (data) {
            if (!this.foundidfcDataBrand.includes(data.brandId)) {
              this.foundidfcDataBrand.push(data.brandId);
              this.foundidfc++;
            }
          } else {
            if (!this.notFoundidfcDataBrand.includes(mm.brandId)) {
              this.notFoundidfcDataBrand.push(mm.brandId);
              this.notFoundidfc++;
            }
          }
        });
      } else {
        this.mapped.forEach((x) => {
          const data = idfcassetmasters.find((asm) => {
            return asm.brand == x.brandId;
          });
          if (data) {
            if (!this.foundDataBrand.includes(data.brand)) {
              this.foundDataBrand.push(data.brand);
              this.found++;
            }
          } else {
            if (!this.notFoundDataBrand.includes(x.brandId)) {
              this.notFoundDataBrand.push(x.brandId);
              this.notFound++;
            }
          }
        });

        this.idfcassetmasters.forEach((x) => {
          const data = this.mapped.find((asm) => {
            return asm.brandId == x.brand;
          });
          if (data) {
            if (!this.foundidfcDataBrand.includes(data.brandId)) {
              this.foundidfcDataBrand.push(data.brandId);
              this.foundidfc++;
            }
          } else {
            if (!this.notFoundidfcDataBrand.includes(x.brand)) {
              this.notFoundidfcDataBrand.push(x.brand);
              this.notFoundidfc++;
            }
          }
        });
      }
    },

    startMapAsset() {
      incoming.forEach((x) => {
        this.mapped.push({
          make: x.make,
          brandId: x.make + "-bikes",
          price: x.price,
          assetId: String(
            x.make +
              "-" +
              String(x.model).replace(/ /g, "-").toLocaleLowerCase() +
              "-" +
              String(x.version)
                .replace(/ - /g, "-")
                .replace(/ /g, "-")
                .replace("[", "")
                .replace("]", "")
                .toLocaleLowerCase()
          ),
        });
      });
      if (this.check) {
        this.mapped.forEach((map) => {
          const data = assetmaster.find((asset) => {
            return asset.assetId == map.assetId;
          });
          if (data) {
            if (!this.foundDataBrand.includes(data.assetId)) {
              this.foundDataBrand.push({
                assetId: data.assetId,
                price: map.price,
              });
              this.found++;
            }
          } else {
            console.log(data);
            if (!this.notFoundDataBrand.includes(map.assetId)) {
              this.notFoundDataBrand.push(map.assetId);
              this.notFound++;
            }
          }
        });

        this.assetmaster.forEach((mm) => {
          const data = this.mapped.find((mpp) => {
            return mpp.assetId == mm.assetId;
          });
          if (data) {
            if (!this.foundidfcDataBrand.includes(data.assetId)) {
              this.foundidfcDataBrand.push(data.assetId);
              this.foundidfc++;
            }
          } else {
            if (!this.notFoundidfcDataBrand.includes(mm.assetId)) {
              this.notFoundidfcDataBrand.push(mm.assetId);
              this.notFoundidfc++;
            }
          }
        });
      } else {
        this.mapped.forEach((x) => {
          const data = idfcassetmasters.find((asm) => {
            return asm.assetInfoId == x.assetId;
          });
          if (data) {
            if (!this.foundDataBrand.includes(data.assetInfoId)) {
              this.foundDataBrand.push({
                assetId: data.assetInfoId,
                price: x.price,
              });
              this.found++;
            }
          } else {
            if (!this.notFoundDataBrand.includes(x.assetId)) {
              this.notFoundDataBrand.push(x.assetId);
              this.notFound++;
            }
          }
        });

        navigator.clipboard.writeText(JSON.stringify(this.foundDataBrand));

        this.idfcassetmasters.forEach((x) => {
          const data = this.mapped.find((asm) => {
            return asm.assetId == x.assetInfoId;
          });
          if (data) {
            if (!this.foundidfcDataBrand.includes(data.assetId)) {
              this.foundidfcDataBrand.push(data.assetId);
              this.foundidfc++;
            }
          } else {
            if (!this.notFoundidfcDataBrand.includes(x.assetInfoId)) {
              this.notFoundidfcDataBrand.push(x.assetInfoId);
              this.notFoundidfc++;
            }
          }
        });
      }
    },
  },
};
</script>

<style></style>
