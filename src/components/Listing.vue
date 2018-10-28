<template>
  <div id="listing">
    <div class='cross-background'></div>
      <b-container id="listBody"> 
        <b-row>
          <b-col></b-col>     
          <b-col sm="8">
            <div class="text-center"  v-if="loading">
                <br><br>
                <h2 class="text-center" style="color:#777">Loading...</h2>
                <br>
                <div  class=" loading-ripple"><div></div><div></div></div>
            </div>
            <div v-show="error">
              {{ error }}
            </div>
            <div v-show="!loading">
              <h1 style="color:white" class="loancardwrapper">Unsecured Corporate Bonds</h1>
              <div class=" mxauto loancardwrapper" v-for="loan in loans" :key="loan.contract">
               
               <bond addr="loan.contract" :details="loan"></bond>
              </div>
            </div>
          </b-col>
          <b-col></b-col>
        </b-row>
        <b-row align-v="end">
          <!-- <b-pagination class="mx-auto" size="md" :total-rows="100" v-model="currentPage" :per-page="10">
          </b-pagination> -->
        </b-row>
      </b-container>
    </div>
</template>

<script>
import LoanRegistry from '../helper/loanRegistryHelper'
import AuditorsRegistryHelper from '../helper/auditorsRegistryHelper'

import BondHelper from '../helper/bondHelper'
import bond from './Bond.vue'

export default {
  name: 'listing',
  methods: {
    async getBondsData () {
      this.loans = []
      for (var loan in this.loansAddresses) {
        if (this.loansAddresses[loan] !== '0x0000000000000000000000000000000000000000') {
          console.log(this.loansAddresses[loan])
          await this.getSingleBond(this.loansAddresses[loan], loan)
        }
      }
      this.loading = false
    },

    async getSingleBond (address, arrayPosition) {
      await BondHelper.initAddress(address)
      let actualBond = await BondHelper.getBond()
      let timeleft = actualBond[9].c[0] + actualBond[5].c[0] - await BondHelper.getCurrentBlockNumber()
      let granted = !actualBond[0].c[0]
      // console.log(actualBond)
      this.loans[arrayPosition] = {
        contract: address,
        lender: actualBond[0].c[0],
        borrower: actualBond[2].c[0],
        borrowerAddress: actualBond[3],
        principal: actualBond[4].c[0], // in cents
        bidTimeFrame: actualBond[5].c[0],
        timeLeft: timeleft,
        amountRepaid: actualBond[6].c[0],
        complete: actualBond[8],
        defaulted: actualBond[7],
        creationDate: actualBond[9].c[0],
        duration: actualBond[10].c[0],
        interestRate: actualBond[11].c[0],
        granted: granted, 
        rating: actualBond[12].c[0],
        auditorAddress: actualBond[13],
        auditor: 'S&P'
      }
      // this.loans[arrayPosition].auditor = await AuditorsRegistryHelper.getAuditor(actualBond[13])
      // console.log("AUDITOR:",this.loans[arrayPosition].auditor)
    }
  },
  created: async function () {
    this.error = this.loansAddresses = null
    await LoanRegistry.init()
    await BondHelper.init()
    // await AuditorsRegistryHelper.init()
    this.loansAddresses = await LoanRegistry.getLoans(0)
    await this.getBondsData()
  },
  beforeMount: function () {
  },
  mounted: function () {},
  components: {
    'bond': bond
  },
  computed: {

  },
  data () {
    return {
      currentPage: 1,
      loading: true,
      error: null,
      loansAddresses: null,
      loans: [],
      registry: null
    }
  }
}
</script>

<style scoped>
#home {
  width: 100%;
  /* height: 100vh; */
}
#listBody {
  background-color: rgba(0, 0, 0, 0.2);
  height: 100%;
  min-height: 100vh;
  /* radial-gradient(#17a2b8, #FFF, #FFF); */
}
.loancardwrapper {
  width: 100%;
  margin: 1rem;
}

/* ## Spinner ## */
.loading-ripple {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.loading-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: loading-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.loading-ripple div:nth-child(2) {
  animation-delay: -0.9s;
}
@keyframes loading-ripple {
  0% {
    top: 28px;
    left: 28px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: -1px;
    left: -1px;
    width: 58px;
    height: 58px;
    opacity: 0;
  }
}

.cross-background {
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  background: -webkit-linear-gradient(
    -45deg,
    rgba(250, 250, 250, 0.9) 45%,
    rgba(55, 230, 235, 1) 0%
  );

  z-index: -2;
}
</style>
