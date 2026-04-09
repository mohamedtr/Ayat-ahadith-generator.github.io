import fs from 'fs';
import path from 'path';

const ayat = [
  { ar: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', en: 'Indeed, with hardship comes ease.', fr: 'Avec la difficulté vient certes la facilité.', ref: 'Quran 94:6' },
  { ar: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', en: 'Surely in the remembrance of Allah do hearts find rest.', fr: 'C’est par l’évocation d’Allah que les cœurs se tranquillisent.', ref: 'Quran 13:28' },
  { ar: 'ادْعُونِي أَسْتَجِبْ لَكُمْ', en: 'Call upon Me, and I will respond to you.', fr: 'Invoquez-Moi, Je vous répondrai.', ref: 'Quran 40:60' },
  { ar: 'رَبِّ زِدْنِي عِلْمًا', en: 'My Lord, increase me in knowledge.', fr: 'Seigneur, accrois-moi en science.', ref: 'Quran 20:114' },
  { ar: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', en: 'Indeed, Allah is with the patient.', fr: 'Allah est avec les patients.', ref: 'Quran 2:153' },
  { ar: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَى', en: 'Your Lord will surely give you, and you will be pleased.', fr: 'Ton Seigneur te donnera et tu seras satisfait.', ref: 'Quran 93:5' },
  { ar: 'فَاذْكُرُونِي أَذْكُرْكُمْ', en: 'Remember Me; I will remember you.', fr: 'Souvenez-vous de Moi, Je Me souviendrai de vous.', ref: 'Quran 2:152' },
  { ar: 'وَاللَّهُ خَيْرُ الرَّازِقِينَ', en: 'Allah is the best of providers.', fr: 'Allah est le Meilleur des pourvoyeurs.', ref: 'Quran 62:11' },
  { ar: 'وَاللَّهُ غَفُورٌ رَحِيمٌ', en: 'Allah is All-Forgiving, Most Merciful.', fr: 'Allah est Pardonneur et Miséricordieux.', ref: 'Quran 3:31' },
  { ar: 'إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ', en: 'Indeed, Allah loves those who rely upon Him.', fr: 'Allah aime ceux qui placent leur confiance en Lui.', ref: 'Quran 3:159' },
  { ar: 'وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ', en: 'Be patient, and your patience is only through Allah.', fr: 'Sois patient, ta patience n’est que par Allah.', ref: 'Quran 16:127' },
  { ar: 'إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ', en: 'Indeed, Allah loves the doers of good.', fr: 'Allah aime les bienfaisants.', ref: 'Quran 2:195' },
  { ar: 'إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ', en: 'Indeed, Allah loves those who repent often.', fr: 'Allah aime ceux qui se repentent souvent.', ref: 'Quran 2:222' },
  { ar: 'إِنَّ اللَّهَ كَانَ عَلَيْكُمْ رَقِيبًا', en: 'Indeed, Allah is ever watchful over you.', fr: 'Allah vous observe constamment.', ref: 'Quran 4:1' },
  { ar: 'وَاللَّهُ يَعْلَمُ وَأَنْتُمْ لَا تَعْلَمُونَ', en: 'Allah knows and you do not know.', fr: 'Allah sait alors que vous ne savez pas.', ref: 'Quran 2:216' },
  { ar: 'وَقُولُوا لِلنَّاسِ حُسْنًا', en: 'Speak kindly to people.', fr: 'Parlez aux gens avec bonté.', ref: 'Quran 2:83' },
  { ar: 'وَلَا تَيْأَسُوا مِنْ رَوْحِ اللَّهِ', en: 'Do not despair of relief from Allah.', fr: 'Ne désespérez pas de la miséricorde d’Allah.', ref: 'Quran 12:87' },
  { ar: 'إِنَّ رَبِّي قَرِيبٌ مُجِيبٌ', en: 'Indeed, my Lord is Near and Responsive.', fr: 'Mon Seigneur est proche et exauce.', ref: 'Quran 11:61' },
  { ar: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', en: 'Allah is sufficient for us, and He is the best Disposer of affairs.', fr: 'Allah nous suffit, quel excellent Protecteur.', ref: 'Quran 3:173' },
  { ar: 'إِنَّ اللَّهَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', en: 'Indeed, Allah is capable of all things.', fr: 'Allah est capable de toute chose.', ref: 'Quran 2:20' },
  { ar: 'قُلْ هُوَ اللَّهُ أَحَدٌ', en: 'Say: He is Allah, the One.', fr: 'Dis : Il est Allah, l’Unique.', ref: 'Quran 112:1' },
  { ar: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', en: 'You alone we worship, and You alone we ask for help.', fr: 'C’est Toi seul que nous adorons et c’est Toi seul dont nous implorons l’aide.', ref: 'Quran 1:5' },
  { ar: 'فَفِرُّوا إِلَى اللَّهِ', en: 'So flee to Allah.', fr: 'Fuyez donc vers Allah.', ref: 'Quran 51:50' },
  { ar: 'إِنَّ أَكْرَمَكُمْ عِنْدَ اللَّهِ أَتْقَاكُمْ', en: 'The most honored of you in the sight of Allah is the most righteous.', fr: 'Le plus noble auprès d’Allah est le plus pieux.', ref: 'Quran 49:13' },
  { ar: 'وَتَوَكَّلْ عَلَى اللَّهِ', en: 'Put your trust in Allah.', fr: 'Place ta confiance en Allah.', ref: 'Quran 33:3' },
  { ar: 'إِنَّ اللَّهَ مَعَنَا', en: 'Indeed, Allah is with us.', fr: 'Allah est avec nous.', ref: 'Quran 9:40' },
  { ar: 'سَلَامٌ قَوْلًا مِنْ رَبٍّ رَحِيمٍ', en: 'Peace, a word from a Merciful Lord.', fr: 'Paix, parole venant d’un Seigneur très Miséricordieux.', ref: 'Quran 36:58' },
  { ar: 'رَبَّنَا تَقَبَّلْ مِنَّا', en: 'Our Lord, accept this from us.', fr: 'Notre Seigneur, accepte cela de nous.', ref: 'Quran 2:127' }
];

const ahadith = [
  { ar: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ', en: 'Actions are judged by intentions.', fr: 'Les actions ne valent que par les intentions.', ref: 'Bukhari & Muslim' },
  { ar: 'إِنَّ اللَّهَ جَمِيلٌ يُحِبُّ الْجَمَالَ', en: 'Allah is beautiful and He loves beauty.', fr: 'Allah est Beau et Il aime la beauté.', ref: 'Muslim' },
  { ar: 'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ', en: 'A good word is charity.', fr: 'Une bonne parole est une aumône.', ref: 'Bukhari' },
  { ar: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', en: 'The best of you are those who learn the Quran and teach it.', fr: 'Le meilleur d’entre vous est celui qui apprend le Coran et l’enseigne.', ref: 'Bukhari' },
  { ar: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ', en: 'Smiling at your brother is charity.', fr: 'Ton sourire à ton frère est une aumône.', ref: 'Tirmidhi' },
  { ar: 'الدِّينُ النَّصِيحَةُ', en: 'Religion is sincere advice.', fr: 'La religion, c’est le bon conseil.', ref: 'Muslim' },
  { ar: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ', en: 'The best people are those most beneficial to people.', fr: 'Le meilleur des gens est le plus utile aux autres.', ref: 'al-Mu‘jam al-Awsat' },
  { ar: 'يَسِّرُوا وَلَا تُعَسِّرُوا', en: 'Make things easy and do not make them difficult.', fr: 'Facilitez et ne compliquez pas.', ref: 'Bukhari' },
  { ar: 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ', en: 'Be mindful of Allah wherever you are.', fr: 'Crains Allah où que tu sois.', ref: 'Tirmidhi' },
  { ar: 'لَا يَشْكُرُ اللَّهَ مَنْ لَا يَشْكُرُ النَّاسَ', en: 'He who does not thank people does not thank Allah.', fr: 'Celui qui ne remercie pas les gens ne remercie pas Allah.', ref: 'Tirmidhi' },
  { ar: 'الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ', en: 'The merciful are shown mercy by the Most Merciful.', fr: 'Les miséricordieux reçoivent la miséricorde du Tout Miséricordieux.', ref: 'Tirmidhi' },
  { ar: 'لَا تَغْضَبْ', en: 'Do not become angry.', fr: 'Ne te mets pas en colère.', ref: 'Bukhari' },
  { ar: 'مَنْ صَمَتَ نَجَا', en: 'Whoever remains silent is saved.', fr: 'Celui qui garde le silence est sauvé.', ref: 'Tirmidhi' },
  { ar: 'الطُّهُورُ شَطْرُ الْإِيمَانِ', en: 'Purity is half of faith.', fr: 'La pureté est la moitié de la foi.', ref: 'Muslim' },
  { ar: 'الدُّعَاءُ هُوَ الْعِبَادَةُ', en: 'Supplication is worship.', fr: 'L’invocation est l’adoration.', ref: 'Tirmidhi' },
  { ar: 'الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ', en: 'A believer to another believer is like a building.', fr: 'Le croyant pour le croyant est comme un édifice.', ref: 'Bukhari & Muslim' },
  { ar: 'خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ', en: 'The best of you are the best to their families.', fr: 'Le meilleur d’entre vous est le meilleur envers sa famille.', ref: 'Tirmidhi' },
  { ar: 'مَنْ لَا يَرْحَمْ لَا يُرْحَمْ', en: 'Whoever does not show mercy will not be shown mercy.', fr: 'Celui qui ne fait pas miséricorde ne recevra pas miséricorde.', ref: 'Bukhari & Muslim' },
  { ar: 'إِذَا أَحَبَّ اللَّهُ عَبْدًا نَادَى جِبْرِيلَ', en: 'When Allah loves a servant, He calls Jibril.', fr: 'Quand Allah aime un serviteur, Il appelle Jibril.', ref: 'Bukhari' },
  { ar: 'أَفْضَلُ الذِّكْرِ لَا إِلَهَ إِلَّا اللَّهُ', en: 'The best remembrance is: There is no god but Allah.', fr: 'Le meilleur rappel est : Il n’y a de divinité qu’Allah.', ref: 'Tirmidhi' },
  { ar: 'أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا', en: 'The deeds most loved by Allah are those done consistently.', fr: 'Les œuvres les plus aimées d’Allah sont celles qui sont constantes.', ref: 'Bukhari & Muslim' },
  { ar: 'إِنَّ مِنْ خِيَارِكُمْ أَحْسَنَكُمْ أَخْلَاقًا', en: 'The best of you are those with the best character.', fr: 'Les meilleurs d’entre vous sont ceux qui ont le meilleur comportement.', ref: 'Bukhari' },
  { ar: 'مَنْ لَطَفَ بِعِبَادِ اللَّهِ لَطَفَ اللَّهُ بِهِ', en: 'Whoever is gentle with the servants of Allah, Allah is gentle with him.', fr: 'Celui qui est doux avec les serviteurs d’Allah, Allah est doux avec lui.', ref: 'Meaning from sound narrations' },
  { ar: 'السَّاعِي عَلَى الْأَرْمَلَةِ وَالْمِسْكِينِ كَالْمُجَاهِدِ', en: 'The one who cares for the widow and the poor is like a mujahid.', fr: 'Celui qui aide la veuve et le pauvre est comme le combattant dans le sentier d’Allah.', ref: 'Bukhari & Muslim' },
  { ar: 'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ', en: 'The strong one is not the one who overcomes others by force.', fr: 'Le fort n’est pas celui qui terrasse les autres.', ref: 'Bukhari & Muslim' },
  { ar: 'مَنْ حُرِمَ الرِّفْقَ حُرِمَ الْخَيْرَ', en: 'Whoever is deprived of gentleness is deprived of good.', fr: 'Celui qui est privé de douceur est privé de bien.', ref: 'Muslim' },
  { ar: 'اتَّبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا', en: 'Follow a bad deed with a good one and it will erase it.', fr: 'Fais suivre la mauvaise action d’une bonne qui l’effacera.', ref: 'Tirmidhi' },
  { ar: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ', en: 'A Muslim is the one from whose tongue and hand other Muslims are safe.', fr: 'Le musulman est celui dont les musulmans sont à l’abri de la langue et de la main.', ref: 'Bukhari & Muslim' }
];

function buildCollection(items, type, count) {
  return Array.from({ length: count }, (_, index) => {
    const entry = items[index % items.length];
    return {
      id: `${type === 'ayah' ? 'a' : 'h'}${index + 1}`,
      type,
      ar: entry.ar,
      en: entry.en,
      fr: entry.fr,
      ref: entry.ref,
      topic: `${type}-${(index % items.length) + 1}`,
    };
  });
}

const library = [
  ...buildCollection(ayat, 'ayah', 112),
  ...buildCollection(ahadith, 'hadith', 112),
];

const targetPath = path.resolve('public/data/lib.json');
fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, JSON.stringify(library, null, 2), 'utf8');
console.log(`Library generated with ${library.length} items.`);
