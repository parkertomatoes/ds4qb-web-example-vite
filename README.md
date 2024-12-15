# ds4qb-web Example Application

This repo provides an example of using ds4qb-web in a Vite application.

Want to see it in action?
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/parkertomatoes/ds4qb-web-example-vite)

## Getting Started

ds4qb-web can be used in a Vite application, but needs a few configuration tweaks:
    1. Bundle V86
    2. Disable some dependency optimization

After that, the library can be used as expected
    3. HTML
    4. CSS
    5. Javascript

### 1. Bring your own V86

ds4qb-web uses the V86 emulator to emulate a DOS PC, but V86 is not distributed in a bundler-friendly package. To avoid packaging issues, V86 should be [downloaded](https://github.com/copy/v86/releases/tag/latest) and included as a static asset by placing it in the public folder, or using [vite-plugin-static-copy](https://www.npmjs.com/package/vite-plugin-static-copy) plugin:
```js
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { defineConfig } from 'vite';
export default defineConfig({
    // ...
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: './v86',
                    dest: 'v86'
                }
            ]
        })
    ],
    // ...
 });
```

V86 requires a few other static assets, which should be copied the same way:
 * An x86 BIOS image (e.g. [seabios](https://github.com/coreboot/seabios))
 * A VGA BIOS ([Bochs](https://github.com/bochs-emu/VGABIOS) includes a good one)
 * A DOS boot disk ([FreeDOS](https://www.freedos.org/) or MS-DOS)

### 2. Disable dependency optimizations for fatfs-wasm and chiptune3

Vite dependency optimization has issues in dev mode bundling Webassembly and worker scripts. Leaving this out makes these libraries work in Vite's dev mode:

```js
import { defineConfig } from 'vite';
export default defineConfig({
    // ...
    optimizeDeps: {
        exclude: ['fatfs-wasm', 'chiptune3']
    }
    // ...
 });
```

### 3. HTML

In the HTML of your page, you need to include V86 with a `<script>` tag before your own script:

```html
<!DOCTYPE html>
<html>
    <head>
        <!-- Include V86 first to add the object to window -->
        <script src="v86/libv86.js"></script>
        
        <!-- Then include your own code -->
        <script type="module" src="src/index.ts"></script>
    </head>
    <!-- ... -->
</html>
```

Then in the body, add an element for V86 to replace with the emulator display:

```html
<!DOCTYPE html>
<html>
    <!-- ... -->
    <body>
        <div id="screen_container">
            <div style="white-space: pre; font: 14px monospace; line-height: 14px"></div>
            <canvas style="display: none"></canvas>
        </div>
    </body>
</html>
```

### 4. A CSS tip

V86 tends to resize the screen to match the resolution. But for old programs, the resolution doesn't always match the screen ratio. VGA mode 13h is 320x200, while old CRT monitors had a 4:3 aspect ratio. Plus, some unusual modex mode had resolutions like 320x400 that look even more distorted. 

You can use CSS to correct this, with the `!important` flag to override V86:
```css
canvas { /* replace with a more specific selector if desired */
    width: 640px !important;
    height: 480px !important;
}
```

### 5. Javascript

Now that all the dependencies and HTML are set, use a single function, `attachDs4qb`, to initialize the emulator and sound driver:

```js
import { attachDS4QB } from 'ds4qb-web';

const parentUrl = new URL('..', import.meta.url);
attachDS4QB(window['V86'], {
    screenContainer: document.getElementById('screen_container') as HTMLElement,

    // The application to load
    content: { url: `${parentUrl}/apps/ds4qb2.zip` },
    autoExe: 'DSDEMO',

    // BIOS, VGA BIOS, boot disk, and emulator URL
    biosFile: { url: `${parentUrl}/bios/seabios.bin` },
    vgaBiosFile: { url: `${parentUrl}/bios/VGABIOS-lgpl.bin` },
    fdaImageFile: { url: `${parentUrl}/img/Dos6.22.img` },
    v86WasmUrl: `${parentUrl}/v86/v86.wasm`,
});
```

