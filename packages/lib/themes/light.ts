import { Theme, ThemeAppearance } from './type';

// OWA Notes default light theme
const theme: Theme = {
	appearance: ThemeAppearance.Light,

	// Color scheme "1" is the basic one, like used to display the note
	// content. It's basically dark gray text on white background
	backgroundColor: '#F6F5F2',
	backgroundColorTransparent: 'rgba(246,245,242,0.92)',
	oddBackgroundColor: '#EFEDE8',
	color: '#2F2F2F', // For regular text
	colorError: 'red',
	colorCorrect: 'green', // Opposite of colorError
	colorWarn: 'rgb(228,86,0)',
	colorWarnUrl: '#4F6D5A',
	colorFaded: '#6E6E6E', // For less important text
	dividerColor: '#D9D6CE',
	selectedColor: '#E3E8E4',
	urlColor: '#4F6D5A',
	colorErrorSelected: '#d00000',
	shadowColor: 'rgba(47,47,47,0.12)',

	// Color scheme "2" is used for the sidebar. It's white text over
	// dark blue background.
	backgroundColor2: '#4F6D5A',
	color2: '#ffffff',
	selectedColor2: '#3D5647',
	colorError2: '#ff7070',
	colorPublished2: '#E0C891',
	colorWarn2: '#F0D39A',
	colorWarn3: '#C58A3D',
	backgroundColorTransparent2: 'rgba(0, 0, 0, 0.1)',

	// Color scheme "3" is used for the config screens for example/
	// It's dark text over gray background.
	backgroundColor3: '#EFEDE8',
	backgroundColorHover3: '#E1E8E2',
	color3: '#5F6A62',

	// Color scheme "4" is used for secondary-style buttons. It makes a white
	// button with blue text.
	backgroundColor4: '#F6F5F2',
	color4: '#4F6D5A',
	backgroundColor4Dimmed: '#E2E9E3',

	raisedBackgroundColor: '#E3E1DB',
	raisedColor: '#2F2F2F',
	searchMarkerBackgroundColor: '#C7A76C',
	searchMarkerColor: 'black',

	warningBackgroundColor: '#E5C88C',
	destructiveColor: '#D00707',

	tableBackgroundColor: '#F1F0EC',
	codeBackgroundColor: '#ECEBE7',
	codeBorderColor: '#D8D5CC',
	codeColor: 'rgb(0,0,0)',

	blockQuoteOpacity: 0.7,

	codeMirrorTheme: 'default',
	codeThemeCss: 'atom-one-light.css',

	headerBackgroundColor: '#EDEBE6',
	textSelectionColor: '#7D8F69',
	colorBright2: '#ffffff',
};

export default theme;
