export interface ReelEntry {
  title: string;
  url: string;
}

export type PlanetReels = {
  [signIndex: number]: ReelEntry[];
};

export const REELS_CONFIG: Record<string, PlanetReels> = {
  Sun: {
    0: [
      {
        title: 'Sol em Áries',
        url: 'https://www.instagram.com/reel/DWH0PkKkyD9/?igsh=MThvdnZ5aDhsZ2xweQ==',
      },
    ],
    1: [
      {
        title: 'Sol em Touro',
        url: 'https://www.instagram.com/reel/DXaRjd9ALtN/?igsh=Z2M4cmQ3bmEwbmQz',
      },
    ],
    2: [
      {
        title: 'Sol em Gêmeos',
        url: 'https://www.instagram.com/reel/DYk8ubtCeFg/?igsh=MXVvdjBqdWpjdTRpZw==',
      },
    ],
    3: [
      {
        title: 'Sol em Câncer pt.1',
        url: 'https://www.instagram.com/reel/DZ0xWEuDf9k/?igsh=emM2YjE1a2k3enJw',
      },
      {
        title: 'Sol em Câncer pt.2',
        url: 'https://www.instagram.com/reel/DZ3WIGjAcPq/?igsh=MTBueDE0ejRzZTF6bQ==',
      },
    ],
    4: [
      {
        title: 'Sol em Leão',
        url: 'https://www.instagram.com/reel/DbGxciNjBd7/?igsh=MTJnazB3YWN2b3ZidQ==',
      },
    ],
    7: [
      {
        title: 'Sol em Escorpião',
        url: 'https://drive.google.com/file/d/1K4RoRqfM35TV-_Mmv0CKwPlY4qGPIDIJ/preview',
      },
    ],
    8: [
      {
        title: 'Sol em Sagitário',
        url: 'https://drive.google.com/file/d/1seW9ZfgXwOUctNVKP43AKZXKnPo8Xqwn/preview',
      },
    ],
    9: [
      {
        title: 'Sol em Capricórnio',
        url: 'https://www.instagram.com/reel/DTRA1xTipMC/?igsh=dXpiZDJvZTl1dDJu',
      },
    ],
    10: [
      {
        title: 'Sol em Aquário',
        url: 'https://www.instagram.com/reel/DTyfl_PEoVq/?igsh=MWs2cjJmZnRxMG9hYQ==',
      },
    ],
    11: [
      {
        title: 'Sol em Peixes',
        url: 'https://www.instagram.com/reel/DU6AedDj2j-/?igsh=MTUzdHZpOTlsbWUzMA==',
      },
    ],
  },
  Moon: {
    0: [
      {
        title: 'Lua em Áries',
        url: 'https://www.instagram.com/reel/Da3_Hn6vrgQ/?igsh=MzN1NGM4YjI4YW5n',
      },
    ],
    1: [
      {
        title: 'Lua em Touro',
        url: 'https://www.instagram.com/reel/Da_w_ErPKLk/?igsh=MTcyODU2dzEya2tncA==',
      },
    ],
  },
  Venus: {
    11: [
      {
        title: 'Vênus em Peixes',
        url: 'https://www.instagram.com/reel/DUlN7cfEdIl/?igsh=cHJpd2RydHd2aGFm',
      },
    ],
    0: [
      {
        title: 'Vênus em Áries',
        url: 'https://www.instagram.com/reel/DViwO0Zj3nY/?igsh=MXgzbjZmZmRmdnlxNQ==',
      },
    ],
    1: [
      {
        title: 'Vênus em Touro',
        url: 'https://www.instagram.com/reel/DWg88SEkZGk/?igsh=eDRoeG5jOTRxeTdu',
      },
    ],
    2: [
      {
        title: 'Vênus em Gêmeos',
        url: 'https://www.instagram.com/reel/DXiACiiiC2q/?igsh=MXJnaWtibzBjYjdjaQ==',
      },
    ],
    4: [
      {
        title: 'Vênus em Leão',
        url: 'https://www.instagram.com/reel/DZgK5XSDTHq/?igsh=MWV6ZzkzNHBtYXljbA==',
      },
    ],
    5: [
      {
        title: 'Vênus em Virgem',
        url: 'https://www.instagram.com/reel/Dagi15bDSzk/?igsh=MWs2OHg0eDlhMWR5Ng==',
      },
    ],
  },
};
