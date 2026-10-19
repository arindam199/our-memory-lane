const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('🧪 Starting Backend & Refresh Persistence Test...');
  const execPath = 'C:/Users/Arindam/.cache/puppeteer/chrome/win64-158.0.8110.0/chrome-win64/chrome.exe';

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: execPath
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('Browser console error:', msg.text());
  });

  await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });

  // 1. Check initial polaroid count
  let polaroidCount = await page.evaluate(() => document.querySelectorAll('.polaroid-wrapper').length);
  console.log('Initial Polaroids count:', polaroidCount);
  if (polaroidCount < 7) {
    throw new Error(`Expected at least 7 polaroids, got ${polaroidCount}`);
  }

  // 2. Upload a test polaroid
  const testImgPath = path.resolve(__dirname, 'assets/images/couple_kiss.jpg');
  const uploadInput = await page.$('#photoUploadInput');
  await uploadInput.uploadFile(testImgPath);

  // Wait a moment for image processing & IndexedDB save
  await new Promise(r => setTimeout(r, 1200));

  let newCount = await page.evaluate(() => document.querySelectorAll('.polaroid-wrapper').length);
  console.log('Polaroids count after upload:', newCount);
  if (newCount !== polaroidCount + 1) {
    throw new Error(`Expected count ${polaroidCount + 1}, got ${newCount}`);
  }

  // 3. Edit custom polaroid caption
  const customCaption = 'Our Special Date in Paris 🗼💕';
  await page.evaluate((text) => {
    const customWrapper = document.querySelector('.polaroid-wrapper[data-custom="true"]');
    if (!customWrapper) throw new Error('Custom polaroid not found in DOM');
    const cap = customWrapper.querySelector('.polaroid-caption');
    cap.textContent = text;
    cap.dispatchEvent(new Event('blur'));
  }, customCaption);

  // 4. Add a new bucket list adventure
  await page.evaluate(() => {
    const input = document.getElementById('newBucketInput');
    input.value = 'Watch sunset together in Santorini 🌅';
    window.addBucketAdventure();
  });

  console.log('Waiting for auto-save to complete...');
  await new Promise(r => setTimeout(r, 1000));

  // 5. REFRESH THE PAGE (simulate user pressing F5 / reloading)
  console.log('🔄 Reloading page to test persistence across refresh...');
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  // 6. Verify state after refresh
  const reloadedCount = await page.evaluate(() => document.querySelectorAll('.polaroid-wrapper').length);
  console.log('Polaroids count AFTER refresh:', reloadedCount);

  if (reloadedCount !== newCount) {
    throw new Error(`FAILED: Count reset after refresh! Expected ${newCount}, got ${reloadedCount}`);
  }

  const restoredCustomCaption = await page.evaluate(() => {
    const custom = document.querySelector('.polaroid-wrapper[data-custom="true"]');
    return custom ? custom.querySelector('.polaroid-caption').textContent.trim() : null;
  });
  console.log('Restored custom caption after refresh:', restoredCustomCaption);

  if (!restoredCustomCaption || !restoredCustomCaption.includes('Paris')) {
    throw new Error(`FAILED: Custom caption not restored! Got: ${restoredCustomCaption}`);
  }

  const restoredBucket = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.bucket-text')).map(el => el.textContent.trim());
    return items.some(t => t.includes('Santorini'));
  });
  console.log('Restored bucket list item after refresh:', restoredBucket);
  if (!restoredBucket) {
    throw new Error('FAILED: Bucket item not restored after refresh!');
  }

  // 7. Test deleting the custom polaroid
  console.log('🗑️ Testing custom polaroid deletion...');
  await page.evaluate(() => {
    const delBtn = document.querySelector('.polaroid-wrapper[data-custom="true"] .polaroid-delete-btn');
    if (delBtn) delBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const afterDeleteCount = await page.evaluate(() => document.querySelectorAll('.polaroid-wrapper').length);
  console.log('Polaroids count after delete:', afterDeleteCount);

  // Refresh again to ensure deletion persisted
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const finalCount = await page.evaluate(() => document.querySelectorAll('.polaroid-wrapper').length);
  console.log('Polaroids count after reload following deletion:', finalCount);
  if (finalCount !== polaroidCount) {
    throw new Error(`Expected count to return to ${polaroidCount}, got ${finalCount}`);
  }

  console.log('Page Errors encountered:', errors);
  if (errors.length > 0) {
    throw new Error(`Uncaught page errors: ${errors.join(', ')}`);
  }

  console.log('🎉 ALL PERSISTENCE & REFRESH TESTS PASSED WITH 100% SUCCESS!');
  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('❌ Test Failed:', err);
  process.exit(1);
});
