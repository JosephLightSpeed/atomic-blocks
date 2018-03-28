/**
 * BLOCK: Atomic Blocks Author Profile
 */

// Import block dependencies and components
import classnames from 'classnames';
import Inspector from './components/inspector';
import ProfileBox from './components/profile';
import SocialIcons from './components/social';
import AvatarColumn from './components/avatar';
import icons from './components/icons';
import * as fontSize from './../../utils/helper';

// Import styles
import './styles/style.scss';
import './styles/editor.scss';

// Internationalization
const { __ } = wp.i18n; 

// Extend component
const { Component } = wp.element;

// Register components
const { 
	registerBlockType,
	RichText,
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
	MediaUpload,
} = wp.blocks;

// Register Inspector components
const {
	Button,
} = wp.components;

class ABProfileBlock extends Component {
	
	render() {
		const { isSelected, className, setAttributes, fontSize } = this.props;
		const { profileName, profileTitle, content, alignment, imgURL, imgID, imgAlt, blockFontSize, blockBackgroundColor, blockTextColor, blockLinkColor, twitter, facebook, instagram, pinterest, google, youtube, github, email, website, avatarShape } = this.props.attributes;

		// Populate the image when selected
		const onSelectImage = img => {
			this.props.setAttributes( {
				imgID: img.id,
				imgURL: img.url,
				imgAlt: img.alt,
			} );
		};

		// Set the font ratio
		const setFontRatio = ( ratio ) => this.props.setAttributes( { blockFontSize: ratio } );

		// Avatar shape options
		const avatarShapeOptions = [
			{ value: 'square', label: __( 'Square' ) },
			{ value: 'round', label: __( 'Round' ) },
		];

		// Build the avatar upload button
		const MediaUploadAvatar = ( props ) => (
			<div class="profile-image-square">
				<MediaUpload
					buttonProps={ {
						className: 'change-image'
					} }
					onSelect={ onSelectImage }
					type="image"
					value={ imgID }
					render={ ( { open } ) => (
						<Button onClick={ open }>
							{ icons.upload }
						</Button>
					) }
				>
				</MediaUpload>

				{ this.props.children }
			</div>
		);

		return [
			// Show the block alignment controls on focus
			isSelected && (
				<BlockControls key="controls">
					<AlignmentToolbar
						value={ alignment }
						onChange={ ( value ) => this.props.setAttributes( { alignment: value } ) }
					/>
				</BlockControls>
			),
			// Show the block controls on focus
			isSelected && (
				<Inspector
					{ ...{ setFontRatio, avatarShapeOptions, ...this.props} }
				/>
			),
			// Show the block markup in the editor
			<ProfileBox { ...this.props }>
				<AvatarColumn { ...this.props }>
					<div class="profile-image-square">
						<MediaUpload
							buttonProps={ {
								className: 'change-image'
							} }
							onSelect={ onSelectImage }
							type="image"
							value={ imgID }
							render={ ( { open } ) => (
								<Button onClick={ open }>
									{ ! imgID ? icons.upload : <img
										class="profile-avatar"
										src={ imgURL }
										alt={ imgAlt }
									/>  }
								</Button>
							) }
						>
						</MediaUpload>
					</div>
				</AvatarColumn>				

				<div 
					className={ classnames(
						'column profile-info'
					) }
				>
					<RichText
						tagName="h2"
						placeholder={ __( 'Add name' ) }
						value={ profileName }
						className='profile-name'
						style={ {
							color: blockTextColor
						} }
						onChange={ ( value ) => this.props.setAttributes( { profileName: value } ) }
					/>
					
					<RichText
						tagName="p"
						placeholder={ __( 'Add title' ) }
						value={ profileTitle }
						className='profile-title'
						style={ {
							color: blockTextColor
						} }
						onChange={ ( value ) => this.props.setAttributes( { profileTitle: value } ) }
					/>

					<RichText
						tagName="div"
						multiline="p"
						placeholder={ __( 'Add profile text...' ) }
						isSelected={ isSelected }
						keepPlaceholderOnFocus
						value={ content }
						formattingControls={ [ 'bold', 'italic', 'strikethrough', 'link' ] }
						className='profile-text'
						onChange={ ( value ) => this.props.setAttributes( { content: value } ) }
					/>

					<SocialIcons { ...this.props } />
				</div>
			</ProfileBox>
		];
	}
}


// Register the block
registerBlockType( 'atomic/atomic-profile-box', {
	title: __( 'AB Profile Box' ),
	description: __( 'Add a user profile box with bio text and social media links.' ),
	icon: 'admin-users',
	category: 'common',
	keywords: [
		__( 'author' ),
		__( 'profile' ),
		__( 'atomic' ),
	],
	// Setup the block attributes
	attributes: {
		profileName: {
			type: 'string',
			selector: '.profile-name',
		},
		profileTitle: {
			type: 'string',
			selector: '.profile-title',
		},
		content: {
			type: 'array',
			selector: '.profile-text',
			source: 'children',
		}, 
		alignment: {
			type: 'string',
		},
		imgURL: {
			type: 'string',
			source: 'attribute',
			attribute: 'src',
			selector: 'img',
		},
		imgID: {
			type: 'number',
		},
		imgAlt: {
			type: 'string',
			source: 'attribute',
			attribute: 'alt',
			selector: 'img',
		},
		blockBackgroundColor: {
			type: 'string',
			default: '#f2f2f2'
		},
		blockTextColor: {
			type: 'string',
			default: '#32373c'
		},
		blockLinkColor: {
			type: 'string',
			default: '#392f43'
		},
		blockFontSize: {
			type: 'number',
			default: 18
		},
		twitter: {
			type: 'url',
		},
		facebook: {
			type: 'url',
		},
		instagram: {
			type: 'url',
		},
		pinterest: {
			type: 'url',
		},
		google: {
			type: 'url',
		},
		youtube: {
			type: 'url',
		},
		github: {
			type: 'url',
		},
		email: {
			type: 'url',
		},
		website: {
			type: 'url',
		},
		avatarShape: {
            type: 'string',
            default: 'square',
        },
	},

	// Render the block components
	edit: ABProfileBlock,

	// Save the attributes and markup
	save: function( props ) {
		return (
			// Save the block markup for the front end
			<ProfileBox { ...props }>
				  
				{ props.attributes.imgURL && (
					<AvatarColumn { ...props }>
						<div class="profile-image-square">
							<img
								class="profile-avatar"
								src={ props.attributes.imgURL }
								alt={ props.attributes.imgAlt }
							/>
						</div>
					</AvatarColumn>
				) }

				<div 
					className={ classnames(
						'column profile-info'
					) }
				>
					{ props.attributes.profileName && (
						<h2 
							className='profile-name'
							style={ {
								color: props.attributes.blockTextColor
							} }
						>{ props.attributes.profileName }</h2>
					) }
					
					{ props.attributes.profileTitle && (
						<p 
							className='profile-title'
							style={ {
								color: props.attributes.blockTextColor
							} }
						>{ props.attributes.profileTitle }</p>
					) }

					{ props.attributes.content && (
						<div className='profile-text'>
							{ props.attributes.content }
						</div>
					) }
					
					<SocialIcons { ...props } />
				</div>
			</ProfileBox>
		);
	},
} );