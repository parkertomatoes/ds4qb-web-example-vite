import { attachDS4QB } from 'ds4qb-web';

const screenContainer = document.getElementById('screen_container');
if (!screenContainer)
    throw ('screen_container not found');

const parentUrl = new URL('..', import.meta.url);
attachDS4QB(window['V86'], {
    screenContainer,

    // The application to load
    content: { url: `${parentUrl}/apps/ds4qb2.zip` },
    autoExe: 'DSDEMO',

    // BIOS, VGA BIOS, boot disk, and emulator URL
    biosFile: { url: `${parentUrl}/bios/seabios.bin` },
    vgaBiosFile: { url: `${parentUrl}/bios/VGABIOS-lgpl.bin` },
    fdaImageFile: { url: `${parentUrl}/img/freedos.boot.disk.320K.img` },
    v86WasmUrl: `${parentUrl}/v86/v86.wasm`,
});