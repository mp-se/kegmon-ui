<template>
    <div class="container">
        <p></p>
        <p class="h3">Taps - History</p>
        <hr>

        <p>TODO: This view is not yet implemented</p>

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { global, config } from "@/modules/pinia"
import { logDebug, logError, logInfo } from '@/modules/logger'

const levels = ref([])

class Level {
    constructor(date, keg1, keg2, pour1, pour2) {
        var v = date.split(' ')
        var d = v[0].split('-')
        var t = v[1].split(':')

        this.date = new Date(d[0], d[1], d[2], t[0], t[1], t[2])
        this.keg1 = keg1
        this.keg2 = keg2
        this.pour1 = pour1
        this.pour2 = pour2

        // logDebug(this.date, this.keg1, this.keg2, this.pour1, this.pour2)
    }

    static fromString(l) {
        var d = l.split(";")
        return new Level(d[0], Number.parseFloat(d[1]), Number.parseFloat(d[2]), Number.parseFloat(d[3]), Number.parseFloat(d[4]))
    }

    get date() { return this._date }
    get keg1() { return this._keg1 }
    get keg2() { return this._keg2 }
    get pour1() { return this._pour1 }
    get pour2() { return this._pour2 }

    set date(date) { this._date = date }
    set keg1(keg1) { this._keg1 = keg1 }
    set keg2(keg2) { this._keg2 = keg2 }
    set pour1(pour1) { this._pour1 = pour1 }
    set pour2(pour2) { this._pour2 = pour2 }
}

onMounted(() => {
    logInfo("TapsHistoryView.onMounted()")

    fetch(global.baseURL + 'levels', {
        method: "GET",
        signal: AbortSignal.timeout(global.fetchTimout),
            })
            .then(res => res.text())
            .then(text => {
                var lines = text.split('\n')

                lines.forEach(l => {
                    levels.value.push(Level.fromString(l))
                })

                logDebug(levels.value)
            })
            .catch(err => {
                logError("TapsHistoryView.onMounted()", err)
            })
})
</script>
