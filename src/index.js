const wait = n => new Promise(res => setTimeout(res, n));
const gameSelector = '#A43 > :not(.clear)';

function down(element) {
  element.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: false,
    }),
  );
}
function up(element) {
  element.dispatchEvent(
    new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: false,
    }),
  );
}
function click(element) {
  down(element);
  up(element);
}
function resetDown(element) {
  element.dispatchEvent(
    new MouseEvent('mouseleave', {
      bubbles: true,
      cancelable: false,
    }),
  );
  up(element);
}
function switchFlag(element) {
  element.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: false,
      button: 2,
    }),
  );
}
function flag(element) {
  if(!element.classList.contains('hd_flag')) {
    switchFlag(element);
  }
}
function unflag(element) {
  if(element.classList.contains('hd_flag')) {
    switchFlag(element);
  }
}
async function newGame() {
  document.querySelector('#top_area_face').click();
  await wait(1000);
}
function getNumber(element) {
  return +[...element.classList].find(e => e.startsWith('hd_type'))?.slice(7) || -1;
}
function getChecks() {
  return document.querySelectorAll(`${gameSelector}.hd_check`);
}
function getXY(element) {
  const x = +element.getAttribute('data-x');
  const y = +element.getAttribute('data-y');
  return { x, y };
}

function getFlagsAround(element) {
  const { x: eX, y: eY } = getXY(element);
  const allFlags = document.querySelectorAll(`${gameSelector}.hd_flag`);

  let flagsAmount = 0;
  for(const flag of allFlags) {
    const { x, y } = getXY(flag);

    if(Math.abs(x - eX) <= 1 && Math.abs(y - eY) <= 1) {
      flagsAmount++;
    }
  }

  return flagsAmount;
}

async function aaaaaaa() {
  let cells = document.querySelectorAll(gameSelector);

  for(let i = 0; i < 5; i++) {
    click(cells[Math.floor(Math.random() * cells.length)]);
    await wait(10);
  }

  let asd = true;
  async function main() {
    let needToRepeat = true;
    while(needToRepeat && document.querySelector('.hd_top-area-face-unpressed')) {
      if(!asd) {
        return;
      }
      needToRepeat = false;
      cells = [
        ...document.querySelectorAll(`${gameSelector}.hd_closed`),
        ...document.querySelectorAll(`${gameSelector}.hd_type1`),
        ...document.querySelectorAll(`${gameSelector}.hd_type2`),
        ...document.querySelectorAll(`${gameSelector}.hd_type3`),
        ...document.querySelectorAll(`${gameSelector}.hd_type4`),
        ...document.querySelectorAll(`${gameSelector}.hd_type5`),
        ...document.querySelectorAll(`${gameSelector}.hd_type6`),
        ...document.querySelectorAll(`${gameSelector}.hd_type7`),
        ...document.querySelectorAll(`${gameSelector}.hd_type8`),
      ];
      for(const cell of cells) {
        if(!asd) {
          return;
        }
        const cellNumber = getNumber(cell);
        if(cellNumber < 1) {
          continue;
        }

        down(cell);
        await wait(10);
        const checkCells = getChecks();
        up(cell);
        await wait(10);
        const flagsAround = getFlagsAround(cell);
        if(checkCells.length + flagsAround === cellNumber) {
          needToRepeat = true;
          for(const checkCell of checkCells) {
            if(!asd) {
              return;
            }
            const { x, y } = getXY(checkCell);
            flag(document.querySelector(`${gameSelector}[data-x="${x}"][data-y="${y}"`));
            await wait(10);
          }
        }
      }
    }

    for(const cell of document.querySelectorAll(`${gameSelector}.hd_closed`)) {
      if(document.querySelector('.hd_top-area-face-unpressed')) {
        click(cell);
        await wait(10);
      }
    }
  }

  await Promise.race([
    wait(5000),
    main(),
  ]);
  asd = false;
}

while(1) {
  await aaaaaaa();
  if(!document.querySelector('.hd_top-area-face-win')) {
    await newGame();
  }
}
