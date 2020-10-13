#!/usr/bin/env node

const puppeteer = require('puppeteer');
const probe = require('probe-image-size');
const style = require('ansi-styles');
const yargs = require('yargs/yargs');

const args = yargs(process.argv.slice(2))
    .command('$0 <url>', 'Check URL for any images displayed too large/small', (yargs) => {
        yargs.positional('url', {
            describe: 'URL to check images on'
        }).demandOption('url')
    })
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        default: false,
        description: 'Run with verbose logging'
    })
    .option('maxShrinkRatio', {
        type: 'number',
        default: '0.8'
    })
    .option('maxGrowRatio', {
        type: 'number',
        default: 1.2
    })
    .argv;

(async () => {
    const browser = await puppeteer.launch();

    var checkPage = async function(width, height, scaleFactor) {
        const page = await browser.newPage();
        page.setViewport({
            width: width,
            height: height,
            deviceScaleFactor: scaleFactor
        });

        console.log("Inspecting page: %d x %d (scale factor: %d)", width, height, scaleFactor);
        await page.goto(args.url, {waitUntil: 'networkidle2'});

        var msgs = await page.$$eval('img', function(elems) {
            var m = [];
            elems.forEach(function(elem) {
                if (elem.currentSrc.slice(0, 5) == "data:") {
                    // Ignore data: url images
                    return;
                }

                if (elem.offsetWidth == 0 && elem.offsetHeight == 0) {
                    // Most likely a hidden element
                    return;
                }
                m.push({
                    src: elem.currentSrc,
                    w: elem.width,
                    h: elem.height
                });
            });
            return m;
        });

        page.close();

        await Promise.all(msgs.map((e) => {
            return probe(e.src, { timeout: 5000 }).then(function(r) {
                if (r.type == 'svg') {
                    return;
                }

                var displayedArea = ((e.w * scaleFactor) * (e.h * scaleFactor)),
                    imgArea = r.width * r.height,
                    ratio = displayedArea / imgArea;

                if (ratio < args.maxShrinkRatio && Math.abs(displayedArea - imgArea) > 200) {
                    console.log(style.red.open + "Src: %s (Displayed: %d x %d (%dx), Image: %d x %d). Ratio: %f" + style.red.close, e.src, e.w, e.h, scaleFactor, r.width, r.height, Math.round(ratio*100)/100);
                } else if (ratio > args.maxGrowRatio && Math.abs(displayedArea - imgArea) > 200) {
                    console.log(style.yellow.open + "Src: %s (Displayed: %d x %d (%dx), Image: %d x %d). Ratio: %f" + style.yellow.close, e.src, e.w, e.h, scaleFactor, r.width, r.height, Math.round(ratio*100)/100);

                }
            }).catch(function(e2) {
                if (args.v) {
                    console.log("Unable to fetch %s", e.src);
                }
            });
        }));
        console.log("\n\n");
    };

    await checkPage(3840, 1000, 1);
    await checkPage(2560, 1000, 1);
    await checkPage(1920, 1000, 1);
    await checkPage(1440, 1000, 1);
    await checkPage(1366, 1000, 1);
    await checkPage(1366, 1000, 2);
    await checkPage(1024, 1000, 1);
    await checkPage(768, 1000, 2);
    await checkPage(768, 1000, 1);
    await checkPage(414, 1000, 3);
    await checkPage(414, 1000, 2);
    await checkPage(414, 1000, 1);
    await checkPage(375, 1000, 3);
    await checkPage(375, 1000, 2);
    await checkPage(375, 1000, 1);
    await checkPage(320, 1000, 2);
    await checkPage(320, 1000, 1);

    await browser.close();
})();
