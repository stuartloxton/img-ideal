# img-ideal

Tool for finding images being served at the wrong size.

## Usage
```
$ ./img-ideal.js --help
img-ideal.js <url>

Check URL for any images displayed too large/small

Positionals:
  url  URL to check images on                                         [required]

Options:
      --help            Show help                                      [boolean]
      --version         Show version number                            [boolean]
  -v, --verbose         Run with verbose logging      [boolean] [default: false]
      --maxShrinkRatio                                 [number] [default: "0.8"]
      --maxGrowRatio                                     [number] [default: 1.2]
```

## Example
```
./img-ideal.js https://www.bbc.co.uk/news

Inspecting page: 414 x 1000 (scale factor: 1)
Src: https://ichef.bbci.co.uk/news/240/cpsprodpb/A3C9/production/_114892914_mediaitem114887391.jpg (Displayed: 183 x 103 (1x), Image: 240 x 135). Ratio: 0.58
Src: https://ichef.bbci.co.uk/news/240/cpsprodpb/14292/production/_114887528_mediaitem114887526.jpg (Displayed: 183 x 103 (1x), Image: 240 x 135). Ratio: 0.58
Src: https://ichef.bbci.co.uk/news/240/cpsprodpb/D4B1/production/_114894445_braodimage.png (Displayed: 183 x 103 (1x), Image: 240 x 135). Ratio: 0.58
Src: https://ichef.bbci.co.uk/news/240/cpsprodpb/CC94/production/_111527325_index_daily_update_version02_cv_976new.png (Displayed: 183 x 103 (1x), Image: 240 x 135). Ratio: 0.58
Src: https://ichef.bbci.co.uk/news/240/cpsprodpb/2A4D/production/_114892801_ronaldoportugalindex.jpg (Displayed: 183 x 103 (1x), Image: 240 x 135). Ratio: 0.58
```

This shows that on a device with a 414px wide screen and no pixel scale factor 5 images are being served too large.

The ratio is defined as `pixelsDisplayedByDevice / pixelsInSourceImage` so images with ratios below 1 are being served too large, above 1 are being upscaled in browser.
