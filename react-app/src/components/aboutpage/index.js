import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import './aboutpage.css';
import sam from '../../assets/sam.jpeg';
const AboutPage = () => {
	return (
		<>
			<section className='aboutPageContainer'>
				<section className='titlePicName'>
					<img id='samPic' src={sam} alt='sam'></img>
					<section className='titleName'>
						<h1 id='aboutTitle'>Meet the Foodie turned Software Engineer</h1>
						<h2 id='about'>Sam Boyle</h2>
					</section>
				</section>
				<h3>
					Full-Stack Software Engineer, Culinary Enthusiast & Globe-Trotter with
					Managerial Expertise
				</h3>
				<p>
					Located in Walla Walla, WA, Sam Boyle is an aspiring full-stack
					software engineer on the cusp of graduating from App Academy's
					intensive bootcamp program. With a unique blend of leadership skills,
					global experience, culinary passion, and academic background, Sam
					brings a multifaceted approach to problem-solving in software
					development.
				</p>
				<p>
					Born with an insatiable curiosity, Sam earned a Bachelor's degree in
					Counter Terrorism, Security, and Intelligence with a major in
					Criminology from Edith Cowan University in Perth, Australia. He also
					holds an Associate's degree in Enology and Viticulture from Walla
					Walla Community College, demonstrating his broad interests and
					academic rigor.
				</p>
				<p>
					Having lived overseas for over a decade, including 3.5 years in China,
					5 years in Australia, nearly a year in Germany, and extensive travels
					to 30 countries, Sam possesses an international perspective rare in
					the tech industry. This global exposure has not only shaped his
					worldview but has also ignited a love for cooking and savoring food
					from various cultures. It's this culinary enthusiasm that inspired him
					to create the What-to-Cook website, a platform designed to solve the
					everyday dilemma of deciding what to cook while introducing users to
					global cuisines.
				</p>
				<p>
					Before venturing into the realm of software engineering, Sam honed his
					managerial skills in various roles. From serving as a Business Office
					Manager at Brookdale Senior Living to handling diverse
					responsibilities as a General Manager in a liquor store in Australia,
					his experience is as varied as it is rich. His acumen extends to HR
					functions, financial management, and even winemaking duties, offering
					a well-rounded skill set that sets him apart.
				</p>
				<p>
					As he completes his software engineering bootcamp, Sam is eager to
					embark on his journey as a junior-level software engineer. With a
					professional goal centered around continuous learning, he is committed
					to solving the endless puzzles that programming presents.
				</p>
				<p>
					When he isn't coding or troubleshooting complex problems, Sam loves to
					travel and cook. His culinary adventures are not just limited to
					geographical exploration; they extend to the kitchen where he loves
					experimenting with dishes from around the world. A family man at
					heart, Sam cherishes spending quality time with his toddler and
					partner.
				</p>
				<p>
					Driven by an analytical mind, a creative spirit, and a palate for
					international flavors, Sam is excited to contribute his unique blend
					of skills and experiences to a forward-thinking company. As he puts
					it, "My professional goal is to continuously expand my software
					engineering skills while solving all the puzzles that exist in
					programming, including those in the kitchen."
				</p>
				<p>
					For more information, connect with Sam on his website at {' '}
					<a
					href='https://www.samboyle.net'
					target='_blank'
					rel='noopener noreferrer'
					>samboyle.net</a>{' '},
					 {' '}
					<a
						href='https://www.linkedin.com/in/samboyle12/'
						target='_blank'
						rel='noopener noreferrer'
					>
						LinkedIn
					</a>{' '}
					or reach out via email at sboyle05@gmail.com.
				</p>
			</section>
		</>
	);
};

export default AboutPage;
