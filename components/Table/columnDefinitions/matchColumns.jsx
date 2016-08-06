import React from 'react';
import { Link } from 'react-router';
import { YaspBadge } from '../../Player';
import styles from './column.css';
import { API_HOST } from '../../../yasp.config.js';
import constants from 'dotaconstants';

const heroTd = (row, col, field) => (
  <div style={{ marginTop: 5 }}>
    <div>
      <div className={row.isRadiant ? styles.radiant : styles.dire}></div>
      <img src={field ? `${API_HOST}${constants.heroes[field].img}` : ''} style={{ height: 24 }} role="presentation" />
      {row.last_login && row.last_login && <span style={{ marginLeft: 3 }}><YaspBadge /></span>}
    </div>
    {row.account_id ? <Link to={`/players/${row.account_id}`}>{row.personaname}</Link> : 'Anonymous'}
  </div>
);

const heroTdColumn = {
  displayName: 'Player',
  field: 'hero_id',
  width: 3.5,
  displayFn: heroTd,
  sortFn: (row) => (row.player_sort),
};

const abbreviateNumber = function abbreviateNumber(num) {
  return (num < 1000) ? num : `${(num / 1000).toFixed(1)}k`;
};

const overviewColumns = [
  heroTdColumn,
  {
    displayName: 'MMR',
    field: 'solo_competitive_rank',
    width: 1,
    // sortFn: defaultSort,
  },
  {
    displayName: 'LVL',
    field: 'level',
    width: 1,
    // sortFn: defaultSort,
  }, {
    displayName: 'K',
    field: 'kills',
    width: 1,
    // sortFn: defaultSort,
  }, {
    displayName: 'D',
    field: 'deaths',
    width: 1,
    // sortFn: defaultSort,
  }, {
    displayName: 'A',
    field: 'assists',
    width: 1,
    // sortFn: defaultSort,
  }, {
    displayName: 'LH',
    field: 'last_hits',
    width: 1,
    // sortFn: defaultSort,
  }, {
    displayName: 'DN',
    field: 'denies',
    width: 1,
    // sortFn: defaultSort,
  }, {
    displayName: 'G',
    field: 'gold_per_min',
    width: 1,
    displayFn: (row) => abbreviateNumber(row.gold_per_min * row.duration / 60),
    // sortFn: defaultSort,
  }, {
    displayName: 'GPM',
    field: 'gold_per_min',
    width: 1,
    // sortFn: defaultSort,
  }, {
    displayName: 'XPM',
    field: 'xp_per_min',
    width: 1,
    // sortFn: defaultSort,
  }, {
    displayName: 'HD',
    field: 'hero_damage',
    width: 1,
    displayFn: (row) => abbreviateNumber(row.hero_damage),
    // sortFn: defaultSort,
  }, {
    displayName: 'TD',
    field: 'tower_damage',
    width: 1,
    displayFn: (row) => abbreviateNumber(row.tower_damage),
    // sortFn: defaultSort,
  }, {
    displayName: 'HH',
    field: 'hero_healing',
    width: 1,
    displayFn: (row) => abbreviateNumber(row.hero_healing),
    // sortFn: defaultSort,
  }, {
    displayName: 'Items',
    field: '',
    width: 7,
    displayFn: (row) => {
      const itemArray = [];
      for (let i = 0; i < 6; i++) {
        if (constants.items[constants.item_ids[row[`item_${i}`]]]) {
          itemArray.push(<img
            key={i}
            style={{ height: 25, margin: '0 3px' }}
            role="presentation"
            src={`${API_HOST}${constants.items[constants.item_ids[row[`item_${i}`]]].img}`}
          />);
        }
      }
      return itemArray;
    },
  }];
const abUpgradeColumns = [
  heroTdColumn,
];
for (let i = 0; i < 25; i++) {
  abUpgradeColumns.push({
    displayName: i + 1,
    field: 'ability_upgrades_arr',
    index: i,
    width: 1,
    displayFn: (row, column, field) => {
      // TODO - why does this code get executed when the abUpgradeColumnsTable doesn't get rendered...
      if (field) {
        const abilityId = field[column.index];
        const abilityData = constants.abilities[constants.ability_ids[abilityId]];
        if (abilityData) {
          return <img src={`${API_HOST}${abilityData.img}`} style={{ height: 35, position: 'relative', left: -10 }} role="presentation" />;
        }
      }
      return null;
    },
  });
}

const benchmarksColumns = (match) => {
  const cols = [
    heroTdColumn,
  ];
  if (match.players[0] && match.players[0].benchmarks) {
    Object.keys(match.players[0].benchmarks).forEach((key, i) => {
      cols.push({
        displayName: key,
        field: 'benchmarks',
        index: i,
        width: 2,
        displayFn: (row, column, field) => {
          if (field) {
            const bm = field[key];
            return (<div>
              <span>{`${Number(bm.pct).toFixed(2)}%`}</span>
              <span>{bm.raw.toFixed(2)}</span>
            </div>);
          }
          return null;
        },
      });
    });
  }
  return cols;
};

export {
  overviewColumns,
  abUpgradeColumns,
  benchmarksColumns,
};
