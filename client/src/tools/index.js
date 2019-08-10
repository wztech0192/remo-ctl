import Cookies from 'universal-cookie';
import GameConnector from 'game/connector';

export const cookies = new Cookies();

const getSpeed = (strVal, defaultSpeed) => {
  if (strVal === undefined || strVal === null || strVal === '') {
    return defaultSpeed;
  }
  try {
    return parseInt(strVal);
  } catch {
    return defaultSpeed;
  }
};

export const config = {
  mouseSpeed: getSpeed(cookies.get('mouseSpeed'), 4),
  motionSpeed: getSpeed(cookies.get('motionSpeed'), 10),
  scrollSpeed: getSpeed(cookies.get('scrollSpeed'), 10)
};

export const gameConnector = new GameConnector();
