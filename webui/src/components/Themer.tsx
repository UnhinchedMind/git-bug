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
import { NightsStayRounded, WbSunnyRounded } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

const ThemeContext = createContext({
  toggleMode: () => {},
  mode: '',
  switchMode: (mode: string) => {},
});

const useStyles = makeStyles((theme: Theme) => ({
  iconButton: {
    color: fade(theme.palette.primary.contrastText, 0.5),
  },
}));

const LightSwitch = () => {
  const { mode, toggleMode } = useContext(ThemeContext);
  const nextMode = mode === 'light' ? 'dark' : 'light';
  const description = `Switch to ${nextMode} theme`;
  const classes = useStyles();

  return (
    <Tooltip title={description}>
      <IconButton
        onClick={toggleMode}
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
  const savedMode = localStorage.getItem('themeMode');
  const preferedMode = savedMode != null ? savedMode : 'light';
  const [mode, setMode] = useState(preferedMode);

  const toggleMode = () => {
    const preferedMode = mode === 'light' ? 'dark' : 'light';
    localStorage.setItem('themeMode', preferedMode);
    setMode(preferedMode);
  };

  const switchMode = (mode: string) => {
    localStorage.setItem('themeMode', mode);
    setMode(mode);
  };

  const preferedTheme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{ toggleMode: toggleMode, mode: mode, switchMode: switchMode }}
    >
      <ThemeProvider theme={preferedTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

const ThemeSwitcher = () => {
  const { mode, switchMode } = useContext(ThemeContext);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMode = event.target.value;
    switchMode(selectedMode);
    console.log(selectedMode);
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
          label="System default (light/dark)"
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
