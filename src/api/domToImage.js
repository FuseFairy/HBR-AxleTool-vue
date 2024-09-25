import domtoimage from 'dom-to-image-more';
import { Jimp, JimpMime } from 'jimp';
import { useCharStore } from '@/stores/char_stores';
import { useSkillStore } from '@/stores/skill_stores';
import { useSliderStore } from '@/stores/slider_stores';

export async function convertElementToPng(elementId) {
	const element = document.getElementById(elementId);

	if (element) {
		const width = element.scrollWidth;
		const height = element.scrollHeight;

		const extraMargin = 20;
		const adjustedHeight = height + extraMargin * 2;

		const charStore = useCharStore();
		const skillStore = useSkillStore();
		const sliderStore = useSliderStore();

		const parameters = JSON.stringify({
			char: charStore.selections,
			skills: skillStore.skills,
			turns: skillStore.turns,
			rows: sliderStore.rows
		});

		try {
				const dataUrl = await domtoimage.toPng(element, { 
					width: width,
					height: adjustedHeight,
					style: { 
						fontFamily: 'Noto Sans TC, sans-serif',
						backgroundColor: 'black',
						color: 'white',
						paddingTop: `${extraMargin}px`,
						paddingBottom: `${extraMargin}px`
					}
				});

				const response = await fetch(dataUrl);
				const blob = await response.blob();
				const arrayBuffer = await blob.arrayBuffer();

				const image = await Jimp.read(arrayBuffer);
				if (!image) {
					throw new Error('Failed to read image');
				}

				image.metadata = {
					parameters: parameters
				};

				const buffer = await image.getBuffer(JimpMime.png);
				const link = document.createElement('a');
				link.href = URL.createObjectURL(new Blob([buffer], { type: 'image/png' }));
				link.download = 'table.png';

				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
		} catch (error) {
				console.error('Error generating or saving image:', error);
		}
	} else {
		console.error(`Element with ID "${elementId}" not found.`);
	}
}
