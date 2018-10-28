<template>
<div class="justify-content-md-center litle-margin">
  <div class='cross-background'></div>
    <!--Form-->
    <div id="my-container" class=""></div>
    <b-form @submit="onSubmit">
      <h2 style="margin-bottom: 2%;"> Create a bond </h2>

      <!-- Principal -->
      <b-form-group id="principal"
                    label="Principal:"
                    label-for="titleInput"
                    style="margin-bottom: 0;">
        <b-form-input id="principalInput"
                      type="text"
                      maxlength="60"
                      placeholder="The principal of the bond"
                      v-model="bondForm.principal"
                      required/>
      </b-form-group>

      <br>
      <!-- Bid Time Frame -->
      <b-form-group id="bidTimeframe"
                    label="Bid Timeframe:"
                    label-for="titleInput"
                    style="margin-bottom: 0;">
        <b-form-input id="bidTimeframeInput"
                      type="text"
                      maxlength="60"
                      placeholder="Time allowing to bid"
                      v-model="bondForm.bidTimeframe"
                      required/>
      </b-form-group>
      
      <br>
      <!-- Maturity -->
      <b-form-group id="maturity"
                    label="Maturity: (years)"
                    label-for="titleInput"
                    style="margin-bottom: 0;">
        <b-form-input id="maturityInput"
                      type="text"
                      maxlength="60"
                      placeholder="Time to return the loan"
                      v-model="bondForm.maturity"
                      required/>
      </b-form-group>

      <br>
      <!-- Maximum Interest Rate -->
      <b-form-group id="interestRate"
                    label="Maximum Interest Rate:"
                    label-for="titleInput"
                    style="margin-bottom: 0;">
        <b-form-input id="interestRateInput"
                      type="text"
                      maxlength="60"
                      placeholder="Maximum interest you want for your bond"
                      v-model="bondForm.interestRate"
                      required/>
      </b-form-group>

      <br>
      <!-- Auditor -->
      <b-form-group id="auditor"
                    label="Auditor:"
                    label-for="titleInput"
                    style="margin-bottom: 0;">
        <b-form-input id="auditorInput"
                      type="text"
                      maxlength="60"
                      placeholder="Who will rate your bond?"
                      v-model="bondForm.auditor"
                      required/>
      </b-form-group>

      <br>
      <br>
      <b-button size='lg' type="submit" variant="primary">Submit</b-button>

    </b-form>
  </div>
</template>

<script>
import { createRequestQRCode, removeRequestQRCode } from '@bloomprotocol/share-kit'
import BondHelper from '../helper/bondHelper'
import LoanRegistry from '../helper/loanRegistryHelper'

export default {
  name: 'create',
  methods: {
    getQRCode () {
      this.requestQRCodeId = createRequestQRCode(this.requestData, document.querySelector('#my-container'), this.options)
    },
    onSubmit () {
      let self = this
      this.getQRCode()
      setTimeout(function () { self.getRequest() }, 5000)
    },
    async getRequest () {
      this.$http.get('https://dbond-server-ekfxmcuhks.now.sh/lastRequest').then(response => {
        this.borrowerId = response.body.bloom_id
        // Close the QR
        removeRequestQRCode(this.requestQRCodeId)
        // Make the metamask transaction
        BondHelper.deploy(
          this.borrowerId,
          this.principal,
          this.bidTimeframe,
          this.maturity,
          this.interestRate,
          LoanRegistry.getAddress(),
          this.auditor
        )
      })
    }
  },
  created: async function () {
    // this.getRequest()
    await BondHelper.init()
    await LoanRegistry.init()
  },
  components: {
  },
  data () {
    return {
      requestQRCodeId: undefined,
      requestData: {
        action: 'request_attestation_data',
        token: '0x8f31e48a585fd12ba58e70e03292cac712cbae39bc7eb980ec189aa88e24d043',
        url: 'https://dbond-server-ekfxmcuhks.now.sh' + '/auth',
        org_logo_url: 'https://bloom.co/images/notif/bloom-logo.png',
        org_name: 'Dbonds',
        org_usage_policy_url: 'https://bloom.co/legal/terms',
        org_privacy_policy_url: 'https://bloom.co/legal/privacy',
        types: ['email','company']
      },
      options: {
        size: 300
      },
      bondForm: {
        borrowerId: undefined,
        principal: undefined,
        bidTimeframe: undefined,
        maturity: undefined,
        interestRate: undefined,
        auditor: undefined
      }
    }
  }
}
</script>

<style scoped>
#create {
  width: 100%;
}
.litle-margin{
  margin: 0% 10%;
  padding: 3% 0%;
  max-width: 800px;
}

.cross-background {
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  background: 
 -webkit-linear-gradient(-45deg, rgba(250, 250, 250, 0.9) 45%, rgba(55, 230, 235, 1) 0%);

z-index:-2;
}
</style>
