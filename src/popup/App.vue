<template>
  <div class="someclass">
    <ul>
      <li></li>
    </ul>

    <p class="text-center" v-if="!json">تکن موجود نمیباشد</p>
    <p class="text-center" v-if="json"> ساعت پایان تکن<span> {{jsonLeft}} </span></p>

    <Button @click="copyToken">گرفتن تکن</Button>
    <Button
      :disabled="draftsPending && json !== null"
      @click="drafts">ارسال پیش نویس ها
    </Button>
  </div>
</template>

<script>
  const JSONKEY = 'json'
  export default {
    data() {
      return {
        json: null,
        draftsPending: false,
      }
    },
    computed: {
      jsonLeft() {
        if (this.json) {
          const date = new Date(this.json.expires_at * 1000)
          if (date > new Date())
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
          this.json = null
          chrome.storage.local.remove([JSONKEY])
          return 0
        }
        return 0
      },
    },
    mounted() {
      chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        // If the received message has the expected format...
        if (msg && msg.command) {
          switch (msg.command) {
            case 'tokenIsHere':

              var prepare = {}
              prepare[JSONKEY] = msg.data
              chrome.storage.local.set(prepare)

              this.json = msg.data

              break
            case 'draftsComplete':
              this.draftsPending = false
              break
            case 'draftsError':
              this.draftsPending = false
              break
          }
        }
      })
      chrome.storage.local.get([JSONKEY], (e) => {
        if (e && e[JSONKEY]) {
          this.json = e[JSONKEY];
        }
      })
    },
    methods: {
      sendCommand(command, callback) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { 'command': command }, callback)
        })
      },
      copyToken() {
        this.sendCommand('getToken')
      },
      drafts() {
        const googleScripts = 'https://script.google.com/macros/s/AKfycby92C7267jwl8wpMBg2gwGzPrzctUWI5pNMR5XGrXaq0xMfzJs/exec'
        fetch(googleScripts, {
          method: "POST",
          body:JSON.stringify({
            token: this.json.access_token
          }),
        })
          .then(r => r.text())
          .then(result => {
            this.draftsPending = false
            console.log(result)
          })
        this.draftsPending = true
      },
    },
  }
</script>

<style lang="scss">
  @font-face {
    font-family: Iran;
    font-style: normal;
    font-weight: 400;
    src: url('/assets/fonts/IRANSansWeb.ttf') format('truetype');
  }

  @font-face {
    font-family: Iran;
    font-style: normal;
    font-weight: 600;
    src: url('/assets/fonts/IRANSansWeb_Bold.ttf') format('truetype');
  }

  * {
    font-family: Iran;
  }

  .someclass {
    direction: rtl;
  }

  .text-center {
    text-align: center;
  }
</style>
