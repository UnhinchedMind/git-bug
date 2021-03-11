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

type Mode = 'light' | 'dark' | 'system';

interface IModeContext {
  mode: Mode;
  switchMode: (mode: Mode) => void;
}

const ThemeContext = createContext<IModeContext>({} as IModeContext);

const LightSwitch = () => {
  //TODO system mode won't change sun/moon icon
  const { mode, switchMode } = useContext(ThemeContext);
  const nextMode = mode === 'light' ? 'dark' : 'light';
  const description = `Switch to ${nextMode} theme`;
  const classes = useStyles();

  return (
    <Tooltip title={description}>
      <IconButton
        onClick={() => {
          switchMode(nextMode as Mode);
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
  const [mode, setMode] = useState<Mode>('system');

  const switchMode = (preferedMode: Mode) => {
    localStorage.setItem('themeMode', preferedMode);
    setMode(preferedMode);
  };

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const preferedTheme = (mode: Mode): Theme => {
    const systemMode = prefersDarkMode ? 'dark' : 'light';
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
    <ThemeContext.Provider value={{ mode: mode, switchMode: switchMode }}>
      <ThemeProvider theme={preferedTheme(mode)}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

const ThemeSwitcher = () => {
  const { mode, switchMode } = useContext(ThemeContext);

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
        value={mode}
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
