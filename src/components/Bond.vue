<template>
  <b-card>
        <b-row>
          <b-col cols=4>
            <b-card bg-variant="light"
                  header="Audit"
                  class="text-center">
              <p class="card-text">
                <b-progress :value="14" :max="20" variant="secondary"></b-progress>
                <br>
                <button type="button" class="btn btn-secondary btn-sm">{{ details.auditor }}  </button>
                   
              </p>
            </b-card>
          </b-col>
          <b-col cols="8">
            <h3>Bond  <b-badge variant="info">{{details.principal/100}}  ♦</b-badge></h3> 
            <h5>Borrower Bloom Id  
              <b-badge>
                {{details.borrower}} 

<svg viewBox="0 0 656 656" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="20px"><title></title><desc>Bloom Logo</desc><defs></defs><g id="Full-Logo" stroke="none" stroke-width="1" fill="currentColor" fill-rule="evenodd"><g id="Logo" transform="translate(-43.000000, -24.000000)" fill="currentColor"><g id="Leaf" transform="translate(260.000000, -27.000000)"><path d="M194.415739,215.192523 C194.258317,268.684765
                  150.797287,312 97.2080838,312 C43.6188804,312
                  0.157850908,268.684765 0.000429008653,215.192523
                  C2.08721929e-14,215.192523 -3.50299401,197.114019
                  15.1796407,156.874766 C47.118659,88.0834938
                  95.9422811,58.317757 95.9422811,58.317757 C95.9422811,58.317757
                  148.877246,91.5588785 180.404192,156.874766 C196.94399,191.141061
                  194.416168,215.192523 194.416168,215.192523 Z" id="Combined-Shape"></path></g><g id="Leaf" transform="translate(357.500000, 576.000000) scale(1, -1)
              translate(-357.500000, -576.000000)
              translate(260.000000, 420.000000)"><path d="M194.415739,215.192523 C194.258317,268.684765
                150.797287,312 97.2080838,312 C43.6188804,312 0.157850908,268.684765
                0.000429008653,215.192523 C2.08721929e-14,215.192523 -3.50299401,197.114019
                15.1796407,156.874766 C47.118659,88.0834938 95.9422811,58.317757
                95.9422811,58.317757 C95.9422811,58.317757 148.877246,91.5588785
                180.404192,156.874766 C196.94399,191.141061 194.416168,215.192523
                194.416168,215.192523 Z" id="Combined-Shape"></path></g><g id="Leaf" transform="translate(563.000000, 352.500000) scale(1, -1)
              rotate(90.000000) translate(-563.000000, -352.500000)
              translate(465.500000, 196.500000)"><path d="M194.415739,215.192523 C194.258317,268.684765 150.797287,312
                97.2080838,312 C43.6188804,312 0.157850908,268.684765
                0.000429008653,215.192523 C2.08721929e-14,215.192523
                -3.50299401,197.114019 15.1796407,156.874766 C47.118659,88.0834938
                95.9422811,58.317757 95.9422811,58.317757 C95.9422811,58.317757
                148.877246,91.5588785 180.404192,156.874766 C196.94399,191.141061
                194.416168,215.192523 194.416168,215.192523 Z" id="Combined-Shape"></path></g><g id="Leaf" transform="translate(147.000000, 351.500000)
              scale(-1, -1) rotate(90.000000) translate(-147.000000, -351.500000)
              translate(49.500000, 195.500000)"><path d="M194.415739,215.192523 C194.258317,268.684765 150.797287,312
                97.2080838,312 C43.6188804,312 0.157850908,268.684765
                0.000429008653,215.192523 C2.08721929e-14,215.192523
                -3.50299401,197.114019 15.1796407,156.874766 C47.118659,88.0834938
                95.9422811,58.317757 95.9422811,58.317757 C95.9422811,58.317757
                148.877246,91.5588785 180.404192,156.874766 C196.94399,191.141061
                194.416168,215.192523 194.416168,215.192523 Z" id="Combined-Shape"></path></g></g></g></svg>

              </b-badge>  
            </h5>
            <h5>Interests  <b-badge>{{details.interestRate/100}}  %</b-badge>  </h5>
            <br><br>
            <div slot="" class="text-right" align-v="end"><i>Days left to bit {{Math.floor(details.timeLeft/8640)}} </i></div>
            <div slot="" class="text-right" align-v="end">                  
                <b-button  variant="info" size="sm" v-b-modal.infoModal >Information</b-button>
                <b-button variant="danger"  size="sm" @click="showModal" v-if="details.timeLeft/8640 > 1">Bid</b-button>
                <b-button variant="danger"  size="sm" @click="showModal" disabled v-else>Bid</b-button>
                <b-button href="#"  variant="warning" size="sm" >Transfer</b-button>
            </div>
          </b-col>
        </b-row>

<b-modal ref="myModalRef" hide-footer title="Bid for a bond">
      <div class="d-block text-center">
      <!-- Principal -->
      <b-form-group id="interestRate"
                    label="Interest Rate:"
                    label-for="interestRateInput"
                    style="margin-bottom: 0;">
        <b-form-input id="interestRateInput"
                      type="text"
                      maxlength="60"
                      placeholder="The interest rate of the bond"
                      v-model="interestRate"
                      required/>
          <p>Current interest: {{details.interestRate/100}}%</p>
      </b-form-group>

      <b-btn class="mt-4" variant="danger" @click="proposeBid">Propose bid</b-btn>
      <b-btn class="mt-4" variant="outline-danger" @click="hideModal">Close</b-btn>
      </div>
    </b-modal>


      </b-card>
</template>

<script>
import bond from '../helper/bondHelper'
import grades from '../helper/grades'

export default {
  name: 'bond',
  methods: {
    showModal () {
      this.$refs.myModalRef.show()
    },
    hideModal () {
      this.$refs.myModalRef.hide()
    },
    async proposeBid () {
      await bond.initAddress(this.details.contract)
      await bond.addBid(this.interestRate, 34033) // Right now the bloom id is fixed since we have done this already in other part
    }
  },
  beforeCreate: async function () {
    await bond.init()
    // await bond.initAddress(this.addr)

    // this.detailssLength = await LoanRegistry.getLoansLength()
    // this.loansAddresses = await LoanRegistry.getLoans(0)
    // console.log(this.loansAddresses)
  },
  beforeMount: function () {
  },
  mounted: function () {
  },
  props: ['addr', 'details'],
  components: {
  },
  computed: {
    SPgrade () {
      console.log(this.details.grade)

      // const gr= 20-this.info.grade
      // console.log(this.info.grade)
      // return grades["S&PRating"][gr]
      return "KK"
    }
    // colorLoan: function () {
    // console.log(this)
    // const now = + new Date()
    // console.log(this.creationDate + this.bidTimeFrame - now)
    // console.log(this)
    // if(this.creationDate + this.bidTimeFrame - now>0){
    //   return "";
    // } else
    // if (this.lender) {
    //   return "primary"
    // } else {
    //   return "danger"
    // }
    // }
  },
  data () {
    return {
      infos: this.details,
      interestRate: 0
    }
  }
}
</script>

<style scoped>

</style>
