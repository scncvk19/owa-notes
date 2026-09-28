import { Theme, ThemeAppearance } from './type';
import lightTheme from './light';

// OWA Notes default dark theme
const theme: Theme = {
	...lightTheme,

	appearance: ThemeAppearance.Dark,

	// Color scheme "1" is the basic one, like used to display the note
	// content. It's basically dark gray text on white background
	backgroundColor: '#1F2421',
	backgroundColorTransparent: 'rgba(31,36,33,0.92)',
	oddBackgroundColor: '#191D1B',
	color: '#ECEDEB',
	colorError: '#ff4444',
	colorCorrect: '#72b972',
	colorWarn: '#9A5B00',
	colorWarnUrl: '#ffff82',
	colorFaded: '#A7ADA8', // For less important text
	dividerColor: '#3D4841',
	selectedColor: '#3A463F',
	urlColor: '#B7CFBE',
	colorErrorSelected: '#FFD7D7',

	// Color scheme "2" is used for the sidebar. It's white text over
	// dark blue background.
	backgroundColor2: '#26332B',
	color2: '#ffffff',
	selectedColor2: '#4F6D5A',
	colorError2: '#ff6c6c',
	colorPublished2: '#D3B77B',
	colorWarn2: '#E0C07A',
	colorWarn3: '#E0C07A',
	backgroundColorTransparent2: 'rgba(255, 255, 255, 0.1)',

	// Color scheme "3" is used for the config screens for example/
	// It's dark text over gray background.
	backgroundColor3: '#262D28',
	backgroundColorHover3: '#36433B',
	color3: '#dddddd',

	// Color scheme "4" is used for secondary-style buttons. It makes a white
	// button with blue text.
	backgroundColor4: '#1F2421',
	color4: '#AFC8B7',
	backgroundColor4Dimmed: '#313A34',

	raisedBackgroundColor: '#36413A',
	raisedColor: '#ffffff',
	searchMarkerBackgroundColor: '#C7A76C',
	searchMarkerColor: 'black',

	warningBackgroundColor: '#5A4930',
	destructiveColor: '#F07777',

	tableBackgroundColor: '#292F2B',
	codeBackgroundColor: '#2E3530',
	codeBorderColor: '#465149',
	codeColor: '#ffffff',

	codeMirrorTheme: 'material-darker',
	codeThemeCss: 'atom-one-dark-reasonable.css',

	headerBackgroundColor: '#27302A',
	textSelectionColor: '#7D8F69',
};

export default theme;
