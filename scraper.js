const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const URL = "https://en.wikipedia.org/wiki/List_of_pop-punk_bands";

// Function to get additional band information from their Wikipedia page
async function getBandDetails(bandUrl, bandName) {
    try {
        const response = await axios.get(`https://en.wikipedia.org${bandUrl}`);
        const $ = cheerio.load(response.data);
        
        // Extract year formed
        let yearFormed = '';
        const infobox = $('.infobox');
        infobox.find('tr').each((i, element) => {
            const header = $(element).find('th').text().trim().toLowerCase();
            if (header.includes('years active') || header.includes('formed')) {
                yearFormed = $(element).find('td').text().trim().split('–')[0].split('present')[0].trim();
                // Extract just the year
                const yearMatch = yearFormed.match(/\d{4}/);
                if (yearMatch) {
                    yearFormed = yearMatch[0];
                }
            }
        });
        
        // Extract popular songs and albums
        const popularSongs = [];
        const albums = [];
        
        // Define default albums for well-known bands
        const defaultAlbums = {
            'Blink-182': ['Enema of the State', 'Take Off Your Pants and Jacket', 'Blink-182'],
            'Green Day': ['Dookie', 'American Idiot', 'Nimrod'],
            'Sum 41': ['All Killer No Filler', 'Does This Look Infected?', 'Chuck'],
            'Fall Out Boy': ['From Under the Cork Tree', 'Infinity on High', 'Folie à Deux'],
            'Good Charlotte': ['The Young and the Hopeless', 'Good Charlotte', 'Good Morning Revival'],
            'Simple Plan': ['No Pads, No Helmets...Just Balls', 'Still Not Getting Any...', 'Simple Plan'],
            'Paramore': ['Riot!', 'Brand New Eyes', 'All We Know Is Falling'],
            'My Chemical Romance': ['Three Cheers for Sweet Revenge', 'The Black Parade', 'Danger Days'],
            'All Time Low': ['So Wrong, It\'s Right', 'Nothing Personal', 'Don\'t Panic'],
            'The Offspring': ['Smash', 'Americana', 'Conspiracy of One'],
            'New Found Glory': ['Sticks and Stones', 'Catalyst', 'New Found Glory'],
            'The All-American Rejects': ['The All-American Rejects', 'Move Along', 'When the World Comes Down'],
            'Yellowcard': ['Ocean Avenue', 'Lights and Sounds', 'Paper Walls'],
            'Panic! at the Disco': ['A Fever You Can\'t Sweat Out', 'Pretty. Odd.', 'Death of a Bachelor'],
            'Weezer': ['Weezer (Blue Album)', 'Pinkerton', 'Weezer (Green Album)'],
            'Jimmy Eat World': ['Clarity', 'Bleed American', 'Futures'],
            'Taking Back Sunday': ['Tell All Your Friends', 'Where You Want to Be', 'Louder Now'],
            'Neck Deep': ['Life\'s Not Out to Get You', 'The Peace and the Panic', 'Wishful Thinking'],
            'State Champs': ['The Finer Things', 'Around the World and Back', 'Living Proof'],
            'The Wonder Years': ['The Upsides', 'Suburbia I\'ve Given You All and Now I\'m Nothing', 'The Greatest Generation']
        };
        
        // Define default songs for well-known bands
        const defaultSongs = {
            'Blink-182': ['All the Small Things', 'What\'s My Age Again?', 'I Miss You'],
            'Green Day': ['Basket Case', 'Boulevard of Broken Dreams', 'American Idiot'],
            'Sum 41': ['Fat Lip', 'In Too Deep', 'Still Waiting'],
            'Fall Out Boy': ['Sugar, We\'re Goin Down', 'Dance, Dance', 'Thnks fr th Mmrs'],
            'Good Charlotte': ['The Anthem', 'Lifestyles of the Rich & Famous', 'I Just Wanna Live'],
            'Simple Plan': ['Perfect', 'Welcome to My Life', 'I\'m Just a Kid'],
            'Paramore': ['Misery Business', 'Ain\'t It Fun', 'Still Into You'],
            'My Chemical Romance': ['Welcome to the Black Parade', 'Helena', 'Teenagers'],
            'All Time Low': ['Dear Maria, Count Me In', 'Weightless', 'Damned If I Do Ya'],
            'The Offspring': ['Pretty Fly (For a White Guy)', 'Self Esteem', 'Come Out and Play'],
            'New Found Glory': ['Hit or Miss', 'My Friends Over You', 'All Downhill From Here'],
            'The All-American Rejects': ['Swing, Swing', 'Dirty Little Secret', 'Move Along'],
            'Yellowcard': ['Ocean Avenue', 'Only One', 'Lights and Sounds'],
            'Panic! at the Disco': ['I Write Sins Not Tragedies', 'Nine in the Afternoon', 'High Hopes'],
            'Weezer': ['Buddy Holly', 'Island in the Sun', 'Say It Ain\'t So'],
            'Jimmy Eat World': ['The Middle', 'Sweetness', 'Pain'],
            'Taking Back Sunday': ['MakeDamnSure', 'Cute Without the \'E\'', 'You\'re So Last Summer'],
            'Neck Deep': ['In Bloom', 'December', 'Can\'t Kick Up the Roots'],
            'State Champs': ['Elevated', 'Secrets', 'Dead and Gone'],
            'The Wonder Years': ['Came Out Swinging', 'Local Man Ruins Everything', 'Passing Through a Screen Door']
        };
        
        // Additional fallback data for bands not in our main defaults
        const additionalBandData = {
            'Waterparks': {
                albums: ['Double Dare', 'Entertainment', 'Fandom'],
                songs: ['Stupid For You', 'Blonde', 'Turbulent']
            },
            'We the Kings': {
                albums: ['We the Kings', 'Smile Kid', 'Somewhere Somehow'],
                songs: ['Check Yes Juliet', 'Say You Like Me', 'We\'ll Be a Dream']
            },
            '5 Seconds of Summer': {
                albums: ['5 Seconds of Summer', 'Sounds Good Feels Good', 'Youngblood'],
                songs: ['She Looks So Perfect', 'Amnesia', 'Youngblood']
            },
            'Plain White T\'s': {
                albums: ['All That We Needed', 'Every Second Counts', 'Big Bad World'],
                songs: ['Hey There Delilah', '1, 2, 3, 4', 'Rhythm of Love']
            },
            'The Matches': {
                albums: ['E. Von Dahl Killed the Locals', 'Decomposer', 'A Band in Hope'],
                songs: ['Chain Me Free', 'Papercut Skin', 'Salty Eyes']
            },
            'Ramones': {
                albums: ['Ramones', 'Leave Home', 'Rocket to Russia'],
                songs: ['Blitzkrieg Bop', 'I Wanna Be Sedated', 'Pet Sematary']
            },
            'Descendents': {
                albums: ['Milo Goes to College', 'I Don\'t Want to Grow Up', 'Everything Sucks'],
                songs: ['Suburban Home', 'I\'m the One', 'Everything Sucks']
            },
            'NOFX': {
                albums: ['Punk in Drublic', 'White Trash, Two Heebs and a Bean', 'So Long and Thanks for All the Shoes'],
                songs: ['Linoleum', 'Don\'t Call Me White', 'The Separation of Church and Skate']
            },
            'Rancid': {
                albums: ['...And Out Come the Wolves', 'Let\'s Go', 'Life Won\'t Wait'],
                songs: ['Time Bomb', 'Ruby Soho', 'Salvation']
            },
            'Less Than Jake': {
                albums: ['Hello Rockview', 'Anthem', 'Losing Streak'],
                songs: ['All My Best Friends Are Metalheads', 'The Science of Selling Yourself Short', 'Look What Happened']
            }
        };
        
        // Check if we have default albums for this band first
        let useDefaultData = false;
        for (const [knownBand, knownAlbums] of Object.entries(defaultAlbums)) {
            if (bandName.toLowerCase().includes(knownBand.toLowerCase())) {
                albums.push(...knownAlbums);
                useDefaultData = true;
                break;
            }
        }
        
        // Check if we have default songs for this band
        for (const [knownBand, knownSongs] of Object.entries(defaultSongs)) {
            if (bandName.toLowerCase().includes(knownBand.toLowerCase())) {
                popularSongs.push(...knownSongs);
                useDefaultData = true;
                break;
            }
        }
        
        // If not in main defaults, check additional fallback data
        if (!useDefaultData) {
            for (const [bandKey, data] of Object.entries(additionalBandData)) {
                if (bandName.toLowerCase().includes(bandKey.toLowerCase())) {
                    if (data.albums && data.albums.length > 0) {
                        albums.push(...data.albums);
                    }
                    if (data.songs && data.songs.length > 0) {
                        popularSongs.push(...data.songs);
                    }
                    useDefaultData = true;
                    break;
                }
            }
        }
        
        // Extract an image URL if available
        let imageUrl = '';
        const image = infobox.find('img').first();
        if (image.length) {
            imageUrl = image.attr('src');
            if (imageUrl && !imageUrl.startsWith('http')) {
                imageUrl = `https:${imageUrl}`;
            }
            // Try to find albums in the discography section or infobox
            // First check for a discography section
            let discographySection = $('span#Discography, span#Studio_albums, span#Albums').parent().nextUntil('h2');
            
            // If no dedicated discography section, look for notable works in the infobox
            if (discographySection.length === 0) {
                infobox.find('tr').each((i, element) => {
                    const header = $(element).find('th').text().trim().toLowerCase();
                    if (header.includes('album') || header.includes('discography') || header.includes('notable work')) {
                        $(element).find('td li, td a').each((j, item) => {
                            const text = $(item).text().trim();
                            // Skip entries that are just "Discography" or contain "List of"
                            if (text && !text.toLowerCase().includes('discography') && !text.toLowerCase().includes('list of') && albums.length < 3) {
                                albums.push(text);
                            }
                        });
                    }
                });
            } else {
                // Process the discography section
                discographySection.find('li, tr').each((i, element) => {
                    const text = $(element).text().trim();
                    // Skip entries that are just "Discography" or contain "List of"
                    if (text && !text.toLowerCase().includes('discography') && !text.toLowerCase().includes('list of') && 
                        !text.includes('compilation') && !text.includes('EP') && albums.length < 3) {
                        // Try to extract just the album name
                        const albumName = text.split('(')[0].trim();
                        if (albumName) {
                            albums.push(albumName);
                        }
                    }
                });
            }
            
            // If we still don't have albums, try to find them in the article text
            if (albums.length === 0) {
                // Look for album mentions in paragraphs
                $('p').each((i, para) => {
                    const text = $(para).text();
                    // Look for text in quotes that might be album names
                    const albumMatches = text.match(/'([^']+)'/g) || text.match(/"([^"]+)"/g);
                    if (albumMatches) {
                        albumMatches.forEach(match => {
                            const album = match.replace(/[''"]/g, '').trim();
                            // Check if it looks like an album (not too short, not too long)
                            if (album && album.length > 3 && album.length < 50 && 
                                !album.toLowerCase().includes('discography') && 
                                albums.length < 3) {
                                albums.push(album);
                            }
                        });
                    }
                });
            }
            
            // Try to find singles or songs
            // First check for a singles section
            let singlesSection = $('span#Singles, span#Songs, span#Notable_songs').parent().nextUntil('h2');
            
            // If no singles section, check the infobox for singles
            if (singlesSection.length === 0) {
                infobox.find('tr').each((i, element) => {
                    const header = $(element).find('th').text().trim().toLowerCase();
                    if (header.includes('single') || header.includes('song') || header.includes('hit')) {
                        $(element).find('td li, td a').each((j, item) => {
                            const text = $(item).text().trim();
                            if (text && popularSongs.length < 3) {
                                popularSongs.push(text);
                            }
                        });
                    }
                });
            } else {
                // Process the singles section
                singlesSection.find('li, tr').each((i, element) => {
                    const text = $(element).text().trim();
                    if (text && popularSongs.length < 3) {
                        // Try to extract just the song name
                        const songName = text.split('(')[0].trim();
                        if (songName) {
                            popularSongs.push(songName);
                        }
                    }
                });
            }
            
            // If we still don't have songs, try to find them in the first few paragraphs
            if (popularSongs.length === 0) {
                const paragraphs = $('p').slice(0, 3);
                paragraphs.each((i, para) => {
                    const text = $(para).text();
                    const songMatches = text.match(/"([^"]+)"/g);
                    if (songMatches) {
                        songMatches.forEach(match => {
                            const song = match.replace(/"/g, '').trim();
                            if (song && popularSongs.length < 3) {
                                popularSongs.push(song);
                            }
                        });
                    }
                });
            }
        }
        
        // Create a more specific lyric hint
        let lyricHint = `Known for ${bandName}'s unique sound and style`;
        
        // For well-known bands, provide more specific lyric hints
        const lyricHints = {
            'Blink-182': 'Nobody likes you when you\'re 23',
            'Green Day': 'Wake me up when September ends',
            'Sum 41': 'Cause I\'m in too deep, and I\'m trying to keep',
            'Fall Out Boy': 'We\'re going down, down in an earlier round',
            'Good Charlotte': 'Lifestyles of the rich and the famous',
            'Simple Plan': 'I\'m just a kid and life is a nightmare',
            'Paramore': 'That\'s what you get when you let your heart win',
            'My Chemical Romance': 'When I was a young boy, my father took me into the city',
            'All Time Low': 'Dear Maria, count me in',
            'The Offspring': 'You gotta keep \'em separated',
            'New Found Glory': 'My friends over you',
            'The All-American Rejects': 'Gives you hell, that\'s what you get',
            'Yellowcard': 'If I could find you now, things would get better',
            'Panic! at the Disco': 'I write sins not tragedies',
            'Weezer': 'Say it ain\'t so, your drug is a heartbreaker',
            'Jimmy Eat World': 'It just takes some time, little girl, you\'re in the middle of the ride',
            'Taking Back Sunday': 'The truth is you could slit my throat, and with my one last gasping breath',
            'Neck Deep': 'I\'ve been wasting away, but in a different way',
            'State Champs': 'All I want is a place to call my own, to mend the hearts of everyone',
            'The Wonder Years': 'I\'m not sad anymore, I\'m just tired of this place',
            'Mayday Parade': 'I swear that you don\'t have to go',
            'We the Kings': 'Check yes Juliet, are you with me?',
            'The Story So Far': 'I know where you\'ve been, you\'re ruining things again',
            'Real Friends': 'I\'ve been feeling like I\'m underwater and no one really cares',
            'Knuckle Puck': 'I\'ll tell you everything I wish that I had known',
            'Waterparks': 'I\'m a mess, but I\'m still trying my best',
            'NOFX': 'It\'s my job to keep punk rock elite',
            'Descendents': 'I don\'t want to grow up',
            'Rancid': 'Ruby Soho, destination unknown',
            'Less Than Jake': 'The science of selling yourself short',
            'Bowling for Soup': '1985, Debbie just hit the wall',
            'The Starting Line': 'The best of us can find happiness in misery',
            'Motion City Soundtrack': 'I\'m on fire and now I think I\'m ready to bust a move',
            'A Day to Remember': 'If you can\'t hang then, there\'s the door',
            'Ramones': 'Hey ho, let\'s go',
            '5 Seconds of Summer': 'She looks so perfect standing there',
            'Plain White T\'s': 'Hey there Delilah, what\'s it like in New York City?',
            'The Matches': 'We are one spark away from a complete disaster',
            'Avril Lavigne': 'He was a skater boy, she said see you later boy'
        };
        
        // Check if we have a specific lyric hint for this band
        let foundLyricHint = false;
        for (const [knownBand, hint] of Object.entries(lyricHints)) {
            if (bandName.toLowerCase().includes(knownBand.toLowerCase())) {
                lyricHint = hint;
                foundLyricHint = true;
                break;
            }
        }
        
        // If we don't have a specific lyric hint, try to find one in the Wikipedia page
        if (!foundLyricHint) {
            // Look for quotes in the article that might be lyrics
            const paragraphs = $('p').slice(0, 5); // Check first 5 paragraphs
            paragraphs.each((i, para) => {
                if (foundLyricHint) return;
                
                const text = $(para).text();
                // Look for text in quotes that might be lyrics
                const quoteMatches = text.match(/"([^"]{15,60})"/g) || text.match(/'([^']{15,60})'/g);
                if (quoteMatches) {
                    for (const match of quoteMatches) {
                        const quote = match.replace(/['"]/g, '').trim();
                        // Check if it looks like a lyric (not too short, not too long, has some emotion or first person)
                        if (quote && 
                            (quote.includes('I ') || quote.includes('you ') || quote.includes('we ') || 
                             quote.includes('my ') || quote.includes('your ') || quote.includes('our ') ||
                             quote.includes('love') || quote.includes('hate') || quote.includes('feel') ||
                             quote.includes('heart') || quote.includes('soul') || quote.includes('life'))) {
                            lyricHint = quote;
                            foundLyricHint = true;
                            break;
                        }
                    }
                }
            });
            
            // If still no lyric hint, check for a "known for" or "signature" phrase
            if (!foundLyricHint) {
                const fullText = $('p').slice(0, 10).text();
                if (fullText.includes('known for') || fullText.includes('signature')) {
                    const knownForMatch = fullText.match(/known for ([^.]{10,100}\.)/i) || 
                                         fullText.match(/signature ([^.]{10,100}\.)/i);
                    if (knownForMatch && knownForMatch[1]) {
                        lyricHint = knownForMatch[1].trim();
                        foundLyricHint = true;
                    }
                }
            }
            
            // If still no lyric hint, use a more specific generic hint based on genre or era
            if (!foundLyricHint) {
                // Try to determine the era or subgenre
                const fullText = $('p').slice(0, 5).text().toLowerCase();
                if (fullText.includes('90s') || fullText.includes('1990s')) {
                    lyricHint = `Classic 90s pop-punk energy from ${bandName}`;
                } else if (fullText.includes('2000s') || fullText.includes('00s')) {
                    lyricHint = `Defining the 2000s pop-punk sound`;
                } else if (fullText.includes('hardcore') || fullText.includes('metalcore')) {
                    lyricHint = `Blending pop-punk with hardcore intensity`;
                } else if (fullText.includes('emo') || fullText.includes('emotional')) {
                    lyricHint = `Emotional lyrics with pop-punk instrumentation`;
                } else if (fullText.includes('skate') || fullText.includes('skateboard')) {
                    lyricHint = `Skateboard punk anthems that defined a generation`;
                } else {
                    // Random more specific hints
                    const genericHints = [
                        `Anthems for the misunderstood and the restless`,
                        `Songs about friendship, heartbreak, and growing up`,
                        `Catchy hooks with punk rock attitude`,
                        `Fast-paced songs with memorable choruses`,
                        `Energetic tracks that capture youth and rebellion`,
                        `Melodic punk with relatable lyrics`
                    ];
                    lyricHint = genericHints[Math.floor(Math.random() * genericHints.length)];
                }
            }
        }
        
        return {
            yearFormed,
            popularSongs,
            albums,
            lyricHint,
            imageUrl
        };
    } catch (error) {
        console.error(`Error fetching details for ${bandName}: ${error.message}`);
        return {
            yearFormed: '',
            popularSongs: [],
            albums: [],
            lyricHint: `Known for ${bandName}'s unique sound and style`,
            imageUrl: ''
        };
    }
}

// Main function to scrape the Wikipedia page
async function scrapeBands() {
    try {
        console.log('Fetching data from Wikipedia...');
        const response = await axios.get(URL);
        const $ = cheerio.load(response.data);
        
        // Array to store all bands
        const bands = [];
        
        // Find all list items with band links
        $('ul li a').each((i, element) => {
            const bandName = $(element).text().trim();
            const bandUrl = $(element).attr('href');
            
            // Count the number of citations for this band (as a rough popularity metric)
            const citations = $(element).parent().find('sup').length;
            
            if (bandName && bandUrl) {
                bands.push({
                    name: bandName,
                    url: bandUrl,
                    citations: citations
                });
            }
        });
        
        // Filter out non-band entries (navigation links, etc.)
        const filteredBands = bands.filter(band => {
            return band.url.includes('/wiki/') && 
                   !band.url.includes(':') && 
                   !band.url.includes('Main_Page');
        });
        
        // Add a popularity score based on citations and well-known bands
        const popularBands = filteredBands.map(band => {
            // List of well-known pop-punk bands to boost their score
            const wellKnownBands = [
                'Blink-182', 'Green Day', 'Sum 41', 'Fall Out Boy', 'Good Charlotte',
                'Simple Plan', 'New Found Glory', 'All Time Low', 'The Offspring',
                'Paramore', 'My Chemical Romance', 'Yellowcard', 'The All-American Rejects',
                'Avril Lavigne', 'Panic! at the Disco', 'Weezer', 'Jimmy Eat World',
                'A Day to Remember', 'The Wonder Years', 'State Champs', 'Neck Deep',
                'Bowling for Soup', 'Taking Back Sunday', 'The Starting Line', 'Motion City Soundtrack',
                'Mayday Parade', 'We the Kings', 'The Story So Far', 'Real Friends',
                'Knuckle Puck', 'Waterparks', 'NOFX', 'Descendents', 'Rancid', 'Less Than Jake'
            ];
            
            let popularityScore = band.citations;
            
            // Boost score for well-known bands
            if (wellKnownBands.some(knownBand => 
                band.name.toLowerCase().includes(knownBand.toLowerCase()))) {
                popularityScore += 10;
            }
            
            return {
                ...band,
                popularityScore
            };
        });
        
        // Sort by popularity score and take the top 50
        const top50Bands = popularBands
            .sort((a, b) => b.popularityScore - a.popularityScore)
            .slice(0, 50);
        
        console.log(`Found ${top50Bands.length} bands. Fetching additional details...`);
        
        // Create the final JSON structure with additional details
        const bandData = [];
        
        // Process each band to get additional details
        for (let i = 0; i < top50Bands.length; i++) {
            const band = top50Bands[i];
            console.log(`Processing ${i+1}/50: ${band.name}`);
            
            const details = await getBandDetails(band.url, band.name);
            
            bandData.push({
                band: band.name,
                year_formed: details.yearFormed,
                hints: {
                    first_letter: band.name[0],
                    popular_songs: details.popularSongs,
                    albums: details.albums,
                    lyric_hint: details.lyricHint,
                    image_url: details.imageUrl
                }
            });
            
            // Add a small delay to avoid overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Write the data to a JSON file
        fs.writeFileSync('pop_punk_bands.json', JSON.stringify(bandData, null, 2));
        console.log('Successfully created pop_punk_bands.json with the top 50 pop-punk bands!');
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run the scraper
scrapeBands();
