const puppeteer = require('puppeteer');

(async () => {
  const execPath = "C:/Users/Arindam/.cache/puppeteer/chrome/win64-158.0.8110.0/chrome-win64/chrome.exe";
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
    executablePath: execPath
  });

  const page = await browser.newPage();
  const consoleLogs = [];
  const pageErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR CONSOLE:', msg.text());
    }
    consoleLogs.push({ type: msg.type(), text: msg.text() });
  });

  page.on('pageerror', err => {
    console.log('UNCAUGHT PAGE ERROR:', err.message);
    pageErrors.push(err.message);
  });

  console.log('========================================');
  console.log('TEST 1: Loading Page and Basic Sanity');
  console.log('========================================');
  await page.goto('http://localhost:8080?t=' + Date.now(), { waitUntil: 'networkidle2' });
  const pageTitle = await page.title();
  console.log('Page Title:', pageTitle);

  console.log('\n========================================');
  console.log('TEST 2: Theme Switching Engine');
  console.log('========================================');
  for (const theme of ['galaxy', 'minimal', 'pink']) {
    const btn = await page.$(`button[data-theme="${theme}"]`);
    if (btn) {
      await btn.click();
      const currentTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      const isActive = await page.evaluate((t) => document.querySelector(`button[data-theme="${t}"]`).classList.contains('active'), theme);
      console.log(`Theme '${theme}': applied=${currentTheme === theme}, buttonActive=${isActive}`);
    }
  }

  console.log('\n========================================');
  console.log('TEST 3: Romantic Music Player');
  console.log('========================================');
  // Check initial state
  let isMusicActive = await page.evaluate(() => window.isMusicActive);
  let statusText = await page.$eval('#musicStatus', el => el.textContent.trim());
  console.log('Initial music state:', { isMusicActive, statusText });

  // 1. Play track 1 via disc button
  await page.click('#musicToggleBtn');
  await new Promise(r => setTimeout(r, 600));
  isMusicActive = await page.evaluate(() => window.isMusicActive);
  statusText = await page.$eval('#musicStatus', el => el.textContent.trim());
  let trackName = await page.$eval('#musicTrackName', el => el.textContent.trim());
  let isSpinning = await page.evaluate(() => document.getElementById('vinylDisc').classList.contains('spinning'));
  console.log('Playing Track 1 (Disc click):', { isMusicActive, statusText, trackName, isSpinning });

  // 2. Next track to Track 2 (Audio track 1)
  await page.click('#nextTrackBtn');
  await new Promise(r => setTimeout(r, 1000));
  trackName = await page.$eval('#musicTrackName', el => el.textContent.trim());
  statusText = await page.$eval('#musicStatus', el => el.textContent.trim());
  console.log('Next Track (Track 2 - MP3):', { trackName, statusText });

  // 3. Next track to Track 3 (Audio track 2)
  await page.click('#nextTrackBtn');
  await new Promise(r => setTimeout(r, 1000));
  trackName = await page.$eval('#musicTrackName', el => el.textContent.trim());
  statusText = await page.$eval('#musicStatus', el => el.textContent.trim());
  console.log('Next Track (Track 3 - MP3):', { trackName, statusText });

  // 4. Next track to Track 4 (Audio track 3)
  await page.click('#nextTrackBtn');
  await new Promise(r => setTimeout(r, 1000));
  trackName = await page.$eval('#musicTrackName', el => el.textContent.trim());
  statusText = await page.$eval('#musicStatus', el => el.textContent.trim());
  console.log('Next Track (Track 4 - MP3):', { trackName, statusText });

  // 5. Prev track back to Track 3
  await page.click('#prevTrackBtn');
  await new Promise(r => setTimeout(r, 1000));
  trackName = await page.$eval('#musicTrackName', el => el.textContent.trim());
  console.log('Prev Track (Back to Track 3):', { trackName });

  // 6. Pause via Hero Button
  const heroBtnText = await page.$eval('#playMusicHeroBtn', el => el.textContent.trim());
  console.log('Hero Button text while playing:', heroBtnText);
  await page.click('#playMusicHeroBtn');
  await new Promise(r => setTimeout(r, 500));
  isMusicActive = await page.evaluate(() => window.isMusicActive);
  statusText = await page.$eval('#musicStatus', el => el.textContent.trim());
  isSpinning = await page.evaluate(() => document.getElementById('vinylDisc').classList.contains('spinning'));
  console.log('Paused via Hero Button:', { isMusicActive, statusText, isSpinning });

  console.log('\n========================================');
  console.log('TEST 4: Love Counter / Days Together');
  console.log('========================================');
  const days = await page.$eval('#daysCount', el => el.textContent.trim());
  const hours = await page.$eval('#hoursCount', el => el.textContent.trim());
  const minutes = await page.$eval('#minutesCount', el => el.textContent.trim());
  const seconds = await page.$eval('#secondsCount', el => el.textContent.trim());
  console.log('Current Counter:', `${days} days, ${hours} hours, ${minutes} mins, ${seconds} secs`);

  console.log('\n========================================');
  console.log('TEST 5: Polaroid Scrapbook (Flip, Lightbox, Upload)');
  console.log('========================================');
  // Test flip first card
  const flipBtn = await page.$('.polaroid-flip-btn');
  await flipBtn.click();
  await new Promise(r => setTimeout(r, 400));
  let cardFlipped = await page.evaluate(() => document.querySelector('.polaroid-wrapper').classList.contains('flipped'));
  console.log('Card flipped to note:', cardFlipped);

  // Flip back to photo
  await flipBtn.click();
  await new Promise(r => setTimeout(r, 700));
  cardFlipped = await page.evaluate(() => document.querySelector('.polaroid-wrapper').classList.contains('flipped'));
  console.log('Card flipped back to photo:', !cardFlipped);

  // Open Lightbox by clicking the photo container
  await page.evaluate(() => {
    document.querySelector('.polaroid-img-container').scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 400));
  await page.click('.polaroid-img-container');
  await new Promise(r => setTimeout(r, 500));
  let lightboxState = await page.evaluate(() => {
    const modal = document.getElementById('lightboxModal');
    return {
      isOpen: modal.classList.contains('open') && modal.style.display !== 'none',
      imgSrc: document.getElementById('lightboxImg').src,
      caption: document.getElementById('lightboxCaption').textContent.trim()
    };
  });
  console.log('Lightbox opened:', lightboxState);

  // Close Lightbox
  await page.click('#closeLightboxBtn');
  await new Promise(r => setTimeout(r, 400));
  let lightboxClosed = await page.evaluate(() => !document.getElementById('lightboxModal').classList.contains('open'));
  console.log('Lightbox closed:', lightboxClosed);

  console.log('\n========================================');
  console.log('TEST 6: "Remember this day?" Scratch & Reveal');
  console.log('========================================');
  await page.click('#revealMemoryBtn');
  await new Promise(r => setTimeout(r, 400));
  const coverHidden = await page.evaluate(() => document.getElementById('scratchCover').style.display === 'none');
  console.log('Secret memory uncovered:', coverHidden);

  const initialMemoryTitle = await page.$eval('#mysteryTitle', el => el.textContent.trim());
  await page.click('#shuffleMemoryBtn');
  await new Promise(r => setTimeout(r, 400));
  const newMemoryTitle = await page.$eval('#mysteryTitle', el => el.textContent.trim());
  console.log('Shuffled memory:', { from: initialMemoryTitle, to: newMemoryTitle });

  await page.click('#playMemoryAudioBtn');
  await new Promise(r => setTimeout(r, 400));
  console.log('Memory chime clicked successfully');

  console.log('\n========================================');
  console.log('TEST 7: Love Letters (Interactive Envelopes & Modal)');
  console.log('========================================');
  const envelopeCount = await page.evaluate(() => document.querySelectorAll('.open-letter-trigger').length);
  console.log(`Found ${envelopeCount} love letter envelopes`);

  for (let i = 0; i < envelopeCount; i++) {
    await page.evaluate((idx) => {
      document.querySelectorAll('.open-letter-trigger')[idx].scrollIntoView({ block: 'center' });
    }, i);
    await new Promise(r => setTimeout(r, 300));
    const btn = (await page.$$('.open-letter-trigger'))[i];
    await btn.click();
    await new Promise(r => setTimeout(r, 500));
    const title = await page.$eval('#modalLetterTitle', el => el.textContent.trim());
    const date = await page.$eval('#modalLetterDate', el => el.textContent.trim());
    const isOpen = await page.evaluate(() => document.getElementById('letterModal').classList.contains('open'));
    console.log(`Letter ${i + 1} opened: "${title}" (${date}) - isOpen: ${isOpen}`);

    await page.click('#closeLetterModal');
    await new Promise(r => setTimeout(r, 450));
  }
  const modalFinallyClosed = await page.evaluate(() => !document.getElementById('letterModal').classList.contains('open'));
  console.log('Love letter modal closed:', modalFinallyClosed);

  console.log('\n========================================');
  console.log('TEST 8: Future Bucket List (Check, Add, Remove)');
  console.log('========================================');
  const initialProgress = await page.$eval('#bucketProgressText', el => el.textContent.trim());
  console.log('Initial Progress:', initialProgress);

  // Toggle item 3 checkbox by clicking the custom-checkmark
  const item3Checkmark = await page.$('.bucket-checkbox-item:nth-child(3) .custom-checkmark');
  if (item3Checkmark) {
    await item3Checkmark.click();
    await new Promise(r => setTimeout(r, 400));
    const isChecked = await page.evaluate(() => document.querySelector('input[data-id="b3"]').checked);
    const updatedProgress = await page.$eval('#bucketProgressText', el => el.textContent.trim());
    console.log('Item 3 checked:', { isChecked, updatedProgress });
  }

  // Add new adventure
  await page.type('#newBucketInput', 'Watch a sunrise in Kyoto');
  await page.click('#addBucketForm button[type="submit"]');
  await new Promise(r => setTimeout(r, 400));
  const newProgress = await page.$eval('#bucketProgressText', el => el.textContent.trim());
  const itemsCount = await page.evaluate(() => document.querySelectorAll('.bucket-checkbox-item').length);
  console.log('New adventure added:', { itemsCount, newProgress });

  // Remove first item
  const firstRemoveBtn = await page.$('.remove-bucket-btn');
  if (firstRemoveBtn) {
    await firstRemoveBtn.click();
    await new Promise(r => setTimeout(r, 400));
    const itemsCountAfterRemove = await page.evaluate(() => document.querySelectorAll('.bucket-checkbox-item').length);
    console.log('Adventure removed:', { remainingItems: itemsCountAfterRemove });
  }

  console.log('\n========================================');
  console.log('TEST 9: Final Surprise Vault & Top Secret Letter');
  console.log('========================================');
  await page.evaluate(() => {
    document.getElementById('unlockVaultBtn').scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 300));
  await page.click('#unlockVaultBtn');
  await new Promise(r => setTimeout(r, 500));
  const vaultOpen = await page.evaluate(() => document.getElementById('secretModal').classList.contains('open'));
  console.log('Vault Modal open:', vaultOpen);

  // Unfold Top Secret Envelope
  await page.click('#topSecretEnvelope');
  await new Promise(r => setTimeout(r, 600));
  const letterUnfolded = await page.evaluate(() => document.getElementById('unfoldedSecretLetter').classList.contains('open'));
  console.log('Final Love Letter Unfolded:', letterUnfolded);

  // Toggle Secret Promise card
  const firstPromiseCard = await page.$('.secret-promise-card');
  if (firstPromiseCard) {
    await firstPromiseCard.click();
    await new Promise(r => setTimeout(r, 300));
    const isPromiseUnlocked = await page.evaluate(() => document.querySelector('.secret-promise-card').classList.contains('unfolded'));
    console.log('Secret Promise #1 unlocked:', isPromiseUnlocked);
  }

  // Add a new secret promise to vault
  await page.type('#newSecretPromiseInput', 'I promise to dance with you in the kitchen at midnight');
  await page.click('#addSecretPromiseForm button[type="submit"]');
  await new Promise(r => setTimeout(r, 400));
  const promisesCount = await page.evaluate(() => document.querySelectorAll('.secret-promise-card').length);
  console.log('New promise added to vault. Total promises:', promisesCount);

  // Burst Hearts
  await page.click('#burstHeartsBtn');
  await new Promise(r => setTimeout(r, 400));
  console.log('Burst Hearts / Grand Finale triggered');

  // Close Vault
  await page.click('#closeSecretBtn');
  await new Promise(r => setTimeout(r, 400));
  const vaultClosed = await page.evaluate(() => !document.getElementById('secretModal').classList.contains('open'));
  console.log('Vault modal closed:', vaultClosed);

  console.log('\n========================================');
  console.log('TEST 10: Navigation Links Smooth Scroll');
  console.log('========================================');
  const navLinks = await page.$$eval('.nav-links a', links => links.map(l => ({ text: l.textContent, href: l.getAttribute('href') })));
  console.log('Nav links verified:', navLinks);

  console.log('\n========================================');
  console.log('TEST 11: Mobile Responsiveness Viewport (375x667)');
  console.log('========================================');
  await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
  await new Promise(r => setTimeout(r, 500));
  const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
  const docClientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  console.log(`Mobile Viewport test: clientWidth=${docClientWidth}px, bodyScrollWidth=${bodyScrollWidth}px (no horizontal overflow: ${bodyScrollWidth <= docClientWidth})`);

  console.log('\n========================================');
  console.log('FINAL TEST REPORT: Console Errors Audit');
  console.log('========================================');
  console.log('Total Uncaught Page Errors:', pageErrors.length);
  if (pageErrors.length > 0) {
    console.log('Errors:', pageErrors);
  } else {
    console.log('✅ ZERO uncaught JavaScript errors detected!');
  }

  await browser.close();
})();
