import React, { createContext, useContext, useState } from 'react';

import { fade, ThemeProvider } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
//import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import { Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { NightsStayRounded, WbSunnyRounded } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  iconButton: {
    color: fade(theme.palette.primary.contrastText, 0.5),
  },
}));

//TODO change green button hover effect to darker green
//TODO change LightSwitch to not show the state but the action which to be
//     invoked
//TODO code in comments is still required or can be removed
//TODO check persistense of modes

type Mode = 'light' | 'dark' | 'system';

interface IModeContext {
  mode: Mode;
  isSystemMode: boolean;
  switchMode: (mode: Mode) => void;
}

const ThemeContext = createContext<IModeContext>({} as IModeContext);

const LightSwitch = () => {
  const { mode, isSystemMode, switchMode } = useContext(ThemeContext);
  const nextMode = mode === 'light' ? 'dark' : 'light';
  const description = `Switch to ${nextMode} theme`;
  const classes = useStyles();

  console.log('mode: ' + mode + ' nextMode: ' + nextMode);
  console.log('isSystem: ' + isSystemMode);

  return (
    <Tooltip title={description}>
      <IconButton
        onClick={() => {
          switchMode(nextMode);
          console.log('clicked');
        }}
        aria-label={description}
        className={classes.iconButton}
      >
        {mode === 'light' ? <WbSunnyRounded /> : <NightsStayRounded />}
      </IconButton>
    </Tooltip>
  );
};

type Props = {
  children: React.ReactNode;
  lightTheme: Theme;
  darkTheme: Theme;
};
const Themer = ({ children, lightTheme, darkTheme }: Props) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const systemMode = prefersDarkMode ? 'dark' : 'light';

  //const userMode = localStorage.getItem('themeMode');
  //const useUserMode = userMode === 'light' || userMode === 'dark';
  //const preferedMode = useUserMode ? userMode : systemMode;

  const [curMode, setMode] = useState<Mode>('light');

  const switchMode = (mode: Mode) => {
    localStorage.setItem('themeMode', mode);
    setMode(mode);
  };

  const preferedTheme = (mode: Mode): Theme => {
    switch (mode) {
      case 'light':
        return lightTheme;
      case 'dark':
        return darkTheme;
      case 'system':
        return preferedTheme(systemMode);
      default:
        return lightTheme;
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        mode: curMode === 'system' ? systemMode : curMode,
        isSystemMode: curMode === 'system',
        switchMode: switchMode,
      }}
    >
      <ThemeProvider theme={preferedTheme(curMode)}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

const ThemeSwitcher = () => {
  const { mode, isSystemMode, switchMode } = useContext(ThemeContext);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMode = event.target.value;
    switchMode(selectedMode as Mode);
  };

  return (
    <FormControl component="fieldset">
      {/*<FormLabel component="legend">Prefered Theme</FormLabel>*/}
      <RadioGroup
        row
        aria-label="Theme"
        name="Themeswitcher"
        value={isSystemMode ? 'system' : mode}
        onChange={handleChange}
      >
        <FormControlLabel
          value="system"
          control={<Radio />}
          label={'System default'}
        />
        <FormControlLabel
          value="light"
          control={<Radio />}
          label="Light Theme"
        />
        <FormControlLabel value="dark" control={<Radio />} label="Dark Theme" />
      </RadioGroup>
    </FormControl>
  );
};

export { Themer as default, LightSwitch, ThemeSwitcher };
