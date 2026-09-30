/* Lesvos Pass — legal pages content (Terms of use, Terms of sale, Privacy and cookies).
   DRAFT: have these texts reviewed by a lawyer before going live.

   1) Fill in COMPANY once. Empty fields show as a highlighted [ ... ] on the pages.
   2) The texts use {company}, {address}, {vat}, {gemi}, {email}, {phone}, {court}
      which are replaced automatically from COMPANY. */
window.COMPANY = {
  company: "",        // Legal name, e.g. "Lesvos Pass (sole proprietorship of ...)"
  address: "",        // Registered address
  vat: "",            // ΑΦΜ / VAT number
  gemi: "",           // ΓΕΜΗ number
  email: "",          // Contact email
  phone: "",          // Contact phone / WhatsApp
  court: { en: "Mytilene", tr: "Midilli", el: "Μυτιλήνης" },  // Competent courts (city, per language)
  updated: ""         // Last update date, e.g. "1 March 2027"
};

window.LEGAL = {
  /* ================= TERMS OF USE ================= */
  terms: {
    en: {
      title: "Terms of use",
      intro: "These terms apply to everyone who visits or uses the Lesvos Pass website. Please read them carefully.",
      sections: [
        ["Who we are", [
          "This website is operated by {company}, {address}. VAT number: {vat}. General Commercial Registry (GEMI) number: {gemi}.",
          "Contact: {email}, {phone}."
        ]],
        ["Acceptance of these terms", [
          "By using this website you accept these terms. If you do not agree, please do not use the website. Purchases of the card are also governed by our Terms of sale."
        ]],
        ["What the website offers", [
          "The website presents the Lesvos Pass card, the partner businesses that accept it and their offers, and allows you to buy the card online."
        ]],
        ["Partner offers", [
          "Offers are provided by independent partner businesses. We make every effort to keep the information accurate and up to date, but partners may change or withdraw their offers, opening hours or availability.",
          "The products and services you receive at a partner are provided by that partner, who is responsible for them."
        ]],
        ["Intellectual property", [
          "The name, logo, texts, design and all other content of this website belong to {company} and may not be copied or used without our written permission.",
          "Map data: \u00a9 OpenStreetMap contributors, available under the Open Database License (ODbL)."
        ]],
        ["Acceptable use", [
          "You must not use the website for any unlawful purpose, attempt to gain unauthorised access to it, interfere with its operation, or copy, share or reproduce card QR codes."
        ]],
        ["Links to other websites", [
          "The website contains links to third-party services such as Google Maps and WhatsApp. We are not responsible for their content or their privacy practices."
        ]],
        ["Availability", [
          "We aim to keep the website available at all times, but we cannot guarantee that it will be uninterrupted or error-free. We may carry out maintenance or make changes when needed."
        ]],
        ["Liability", [
          "To the extent permitted by law, we are not liable for indirect losses resulting from the use of the website. Nothing in these terms limits your rights as a consumer under applicable law."
        ]],
        ["Changes to these terms", [
          "We may update these terms from time to time. The date of the latest update is shown at the top of this page."
        ]],
        ["Governing law and jurisdiction", [
          "These terms are governed by Greek law. The courts of {court} have jurisdiction. If you are a consumer living in another country, you also keep the protection of the mandatory rules of your country of residence."
        ]],
        ["Contact", [
          "For any question about these terms, contact us at {email}."
        ]]
      ]
    },
    tr: {
      title: "Kullanım koşulları",
      intro: "Bu koşullar, Lesvos Pass web sitesini ziyaret eden veya kullanan herkes için geçerlidir. Lütfen dikkatle okuyun.",
      sections: [
        ["Biz kimiz", [
          "Bu web sitesi {company}, {address} tarafından işletilmektedir. Vergi numarası (ΑΦΜ): {vat}. Genel Ticaret Sicili (ΓΕΜΗ) numarası: {gemi}.",
          "İletişim: {email}, {phone}."
        ]],
        ["Koşulların kabulü", [
          "Bu web sitesini kullanarak bu koşulları kabul etmiş olursunuz. Kabul etmiyorsanız lütfen siteyi kullanmayın. Kart satın alımları ayrıca Satış koşullarımıza tabidir."
        ]],
        ["Web sitesinin sundukları", [
          "Web sitesi Lesvos Pass kartını, kartı kabul eden anlaşmalı işletmeleri ve tekliflerini tanıtır ve kartı online satın almanızı sağlar."
        ]],
        ["Anlaşmalı işletme teklifleri", [
          "Teklifler bağımsız anlaşmalı işletmeler tarafından sunulur. Bilgileri doğru ve güncel tutmak için her türlü çabayı gösteriyoruz; ancak işletmeler tekliflerini, çalışma saatlerini veya müsaitliklerini değiştirebilir ya da geri çekebilir.",
          "Bir işletmede aldığınız ürün ve hizmetler o işletme tarafından sunulur ve sorumluluğu ona aittir."
        ]],
        ["Fikri mülkiyet", [
          "Bu web sitesinin adı, logosu, metinleri, tasarımı ve diğer tüm içeriği {company} şirketine aittir ve yazılı iznimiz olmadan kopyalanamaz veya kullanılamaz.",
          "Harita verileri: \u00a9 OpenStreetMap katkıda bulunanları, Open Database License (ODbL) kapsamında."
        ]],
        ["Kabul edilebilir kullanım", [
          "Web sitesini hukuka aykırı amaçlarla kullanamaz, yetkisiz erişim girişiminde bulunamaz, işleyişine müdahale edemez ve kart QR kodlarını kopyalayamaz, paylaşamaz veya çoğaltamazsınız."
        ]],
        ["Diğer web sitelerine bağlantılar", [
          "Web sitesi Google Haritalar ve WhatsApp gibi üçüncü taraf hizmetlere bağlantılar içerir. Bu hizmetlerin içeriğinden veya gizlilik uygulamalarından sorumlu değiliz."
        ]],
        ["Erişilebilirlik", [
          "Web sitesini her zaman erişilebilir tutmayı amaçlıyoruz; ancak kesintisiz veya hatasız çalışacağını garanti edemeyiz. Gerektiğinde bakım yapabilir veya değişiklikler uygulayabiliriz."
        ]],
        ["Sorumluluk", [
          "Yasanın izin verdiği ölçüde, web sitesinin kullanımından doğan dolaylı zararlardan sorumlu değiliz. Bu koşulların hiçbir hükmü, yürürlükteki mevzuat kapsamında tüketici olarak sahip olduğunuz hakları sınırlamaz."
        ]],
        ["Koşullardaki değişiklikler", [
          "Bu koşulları zaman zaman güncelleyebiliriz. Son güncelleme tarihi sayfanın üst kısmında gösterilir."
        ]],
        ["Uygulanacak hukuk ve yetkili mahkeme", [
          "Bu koşullar Yunan hukukuna tabidir. {court} mahkemeleri yetkilidir. Başka bir ülkede yaşayan bir tüketiciyseniz, ikamet ettiğiniz ülkenin emredici kurallarının sağladığı korumadan da yararlanmaya devam edersiniz."
        ]],
        ["İletişim", [
          "Bu koşullarla ilgili her türlü soru için bize {email} adresinden ulaşabilirsiniz."
        ]]
      ]
    },
    el: {
      title: "Όροι χρήσης",
      intro: "Οι παρόντες όροι ισχύουν για όποιον επισκέπτεται ή χρησιμοποιεί την ιστοσελίδα του Lesvos Pass. Παρακαλούμε διαβάστε τους προσεκτικά.",
      sections: [
        ["Ποιοι είμαστε", [
          "Η ιστοσελίδα λειτουργεί από την επιχείρηση {company}, {address}. ΑΦΜ: {vat}. Αριθμός ΓΕΜΗ: {gemi}.",
          "Επικοινωνία: {email}, {phone}."
        ]],
        ["Αποδοχή των όρων", [
          "Χρησιμοποιώντας την ιστοσελίδα αποδέχεστε τους παρόντες όρους. Αν δεν συμφωνείτε, παρακαλούμε μην τη χρησιμοποιείτε. Οι αγορές της κάρτας διέπονται επιπλέον από τους Όρους πώλησης."
        ]],
        ["Τι προσφέρει η ιστοσελίδα", [
          "Η ιστοσελίδα παρουσιάζει την κάρτα Lesvos Pass, τις συνεργαζόμενες επιχειρήσεις που τη δέχονται και τις προσφορές τους, και επιτρέπει την online αγορά της κάρτας."
        ]],
        ["Προσφορές των συνεργατών", [
          "Οι προσφορές παρέχονται από ανεξάρτητες συνεργαζόμενες επιχειρήσεις. Καταβάλλουμε κάθε προσπάθεια ώστε οι πληροφορίες να είναι ακριβείς και ενημερωμένες, ωστόσο οι συνεργάτες μπορούν να αλλάξουν ή να αποσύρουν τις προσφορές, το ωράριο ή τη διαθεσιμότητά τους.",
          "Τα προϊόντα και οι υπηρεσίες που λαμβάνετε σε ένα κατάστημα παρέχονται από το ίδιο το κατάστημα, το οποίο φέρει και την ευθύνη γι' αυτά."
        ]],
        ["Πνευματική ιδιοκτησία", [
          "Η επωνυμία, το λογότυπο, τα κείμενα, ο σχεδιασμός και κάθε άλλο περιεχόμενο της ιστοσελίδας ανήκουν στην επιχείρηση {company} και δεν επιτρέπεται η αντιγραφή ή χρήση τους χωρίς γραπτή άδεια.",
          "Δεδομένα χάρτη: \u00a9 OpenStreetMap contributors, με άδεια Open Database License (ODbL)."
        ]],
        ["Επιτρεπόμενη χρήση", [
          "Απαγορεύεται η χρήση της ιστοσελίδας για παράνομους σκοπούς, η απόπειρα μη εξουσιοδοτημένης πρόσβασης, η παρέμβαση στη λειτουργία της, καθώς και η αντιγραφή, κοινοποίηση ή αναπαραγωγή των QR codes των καρτών."
        ]],
        ["Σύνδεσμοι προς άλλες ιστοσελίδες", [
          "Η ιστοσελίδα περιέχει συνδέσμους προς υπηρεσίες τρίτων, όπως το Google Maps και το WhatsApp. Δεν ευθυνόμαστε για το περιεχόμενο ή τις πρακτικές απορρήτου τους."
        ]],
        ["Διαθεσιμότητα", [
          "Επιδιώκουμε η ιστοσελίδα να είναι διαθέσιμη συνεχώς, χωρίς όμως να μπορούμε να εγγυηθούμε αδιάλειπτη ή χωρίς σφάλματα λειτουργία. Ενδέχεται να πραγματοποιούμε εργασίες συντήρησης ή αλλαγές όποτε χρειάζεται."
        ]],
        ["Ευθύνη", [
          "Στον βαθμό που επιτρέπει ο νόμος, δεν ευθυνόμαστε για έμμεσες ζημίες από τη χρήση της ιστοσελίδας. Κανένας όρος δεν περιορίζει τα δικαιώματά σας ως καταναλωτή σύμφωνα με την ισχύουσα νομοθεσία."
        ]],
        ["Αλλαγές των όρων", [
          "Ενδέχεται να ενημερώνουμε τους όρους κατά διαστήματα. Η ημερομηνία της τελευταίας ενημέρωσης εμφανίζεται στην κορυφή της σελίδας."
        ]],
        ["Εφαρμοστέο δίκαιο και δικαιοδοσία", [
          "Οι όροι διέπονται από το ελληνικό δίκαιο. Αρμόδια είναι τα δικαστήρια της {court}. Αν είστε καταναλωτής με κατοικία σε άλλη χώρα, διατηρείτε επιπλέον την προστασία των αναγκαστικού δικαίου διατάξεων της χώρας σας."
        ]],
        ["Επικοινωνία", [
          "Για κάθε ερώτηση σχετικά με τους όρους, επικοινωνήστε μαζί μας στο {email}."
        ]]
      ]
    }
  },

  /* ================= TERMS OF SALE ================= */
  sale: {
    en: {
      title: "Terms of sale",
      intro: "These terms apply to every purchase of the Lesvos Pass card, online or at a partner travel agency.",
      sections: [
        ["Seller", [
          "{company}, {address}. VAT number: {vat}. GEMI number: {gemi}. Contact: {email}, {phone}."
        ]],
        ["The product", [
          "Lesvos Pass is a discount card that gives access to offers (discounts or treats) at the partner businesses listed on our website.",
          "Each card has a unique number and QR code. The card does not carry the holder's name. It is available as a digital card (bought online) or as a plastic card (bought at partner travel agencies)."
        ]],
        ["Price and payment", [
          "The price is shown in euros and includes VAT. The price that applies is the one shown at the moment of purchase.",
          "Online payments are processed by a secure payment provider. We do not receive or store your card details."
        ]],
        ["Delivery and activation", [
          "Digital card: it is sent to the email address you provide immediately after payment and is activated at the moment of purchase.",
          "Plastic card: it is activated by the agency at the moment of sale. A card that has not been activated cannot be used."
        ]],
        ["Validity", [
          "The card is valid for 3 months from the date of purchase (for plastic cards, from the date of activation at the agency). After this period it expires and has no value."
        ]],
        ["How to use the card", [
          "Show your card before paying. The partner scans the QR code and applies the offer. Each offer can be used once per partner, during the partner's opening hours and subject to availability.",
          "Offers cannot be exchanged for cash and cannot be combined with other offers unless the partner agrees. The card may not be resold."
        ]],
        ["No refunds and right of withdrawal", [
          "The card is activated immediately after purchase. Before paying online, you expressly request its immediate activation and acknowledge that, to the extent permitted by applicable consumer law, you lose the right of withdrawal.",
          "All sales are final and cards are non-refundable. This does not affect your legal rights, for example if you were charged by mistake or twice, in which case the amount charged in error is refunded."
        ]],
        ["The partner network", [
          "Partners may join or leave the network, or change their offers. We keep the list on our website up to date. The card gives access to the network of partners as it stands at any time, not to a specific partner."
        ]],
        ["Lost card or misuse", [
          "If you lose your card, contact us with the card number or your proof of purchase. Digital cards can be sent again to the email used at purchase.",
          "We may deactivate cards that are copied, shared or used fraudulently."
        ]],
        ["Complaints and dispute resolution", [
          "You can send any complaint to {email}. We will reply as soon as possible.",
          "If we cannot resolve the matter, you may contact an alternative dispute resolution body, such as the Hellenic Consumer Ombudsman (www.synigoroskatanaloti.gr), or the competent courts."
        ]],
        ["Governing law", [
          "These terms are governed by Greek law. The courts of {court} have jurisdiction, without prejudice to the mandatory consumer protection rules of your country of residence."
        ]]
      ]
    },
    tr: {
      title: "Satış koşulları",
      intro: "Bu koşullar, online veya anlaşmalı bir seyahat acentesinden yapılan her Lesvos Pass kartı satın alımı için geçerlidir.",
      sections: [
        ["Satıcı", [
          "{company}, {address}. Vergi numarası (ΑΦΜ): {vat}. ΓΕΜΗ numarası: {gemi}. İletişim: {email}, {phone}."
        ]],
        ["Ürün", [
          "Lesvos Pass, web sitemizde listelenen anlaşmalı işletmelerde tekliflere (indirim veya ikram) erişim sağlayan bir indirim kartıdır.",
          "Her kartın benzersiz bir numarası ve QR kodu vardır. Kartta sahibinin adı yazmaz. Dijital kart (online satın alma) veya plastik kart (anlaşmalı seyahat acentelerinden satın alma) olarak sunulur."
        ]],
        ["Fiyat ve ödeme", [
          "Fiyat euro cinsinden gösterilir ve KDV dahildir. Satın alma anında gösterilen fiyat geçerlidir.",
          "Online ödemeler güvenli bir ödeme sağlayıcısı tarafından işlenir. Kart bilgilerinizi almıyor ve saklamıyoruz."
        ]],
        ["Teslimat ve etkinleştirme", [
          "Dijital kart: Ödemeden hemen sonra belirttiğiniz e-posta adresine gönderilir ve satın alma anında etkinleştirilir.",
          "Plastik kart: Satış anında acente tarafından etkinleştirilir. Etkinleştirilmemiş bir kart kullanılamaz."
        ]],
        ["Geçerlilik", [
          "Kart, satın alma tarihinden itibaren (plastik kartlarda acentede etkinleştirildiği tarihten itibaren) 3 ay geçerlidir. Bu sürenin sonunda geçerliliğini yitirir ve herhangi bir değeri kalmaz."
        ]],
        ["Kartın kullanımı", [
          "Ödemeden önce kartınızı gösterin. İşletme QR kodunu okutur ve teklifi uygular. Her teklif, işletmenin çalışma saatleri içinde ve müsaitlik durumuna bağlı olarak işletme başına bir kez kullanılabilir.",
          "Teklifler nakde çevrilemez ve işletme kabul etmedikçe diğer tekliflerle birleştirilemez. Kart yeniden satılamaz."
        ]],
        ["İade yapılmaması ve cayma hakkı", [
          "Kart, satın alımdan hemen sonra etkinleştirilir. Online ödemeden önce kartın hemen etkinleştirilmesini açıkça talep eder ve yürürlükteki tüketici mevzuatının izin verdiği ölçüde cayma hakkınızı kaybettiğinizi kabul edersiniz.",
          "Tüm satışlar kesindir ve kartlar iade edilmez. Bu durum yasal haklarınızı etkilemez; örneğin yanlışlıkla veya iki kez ücret alınmışsa, hatalı tahsil edilen tutar iade edilir."
        ]],
        ["Anlaşmalı işletme ağı", [
          "İşletmeler ağa katılabilir, ağdan ayrılabilir veya tekliflerini değiştirebilir. Web sitemizdeki listeyi güncel tutuyoruz. Kart, belirli bir işletmeye değil, her an geçerli olan anlaşmalı işletme ağına erişim sağlar."
        ]],
        ["Kayıp kart veya kötüye kullanım", [
          "Kartınızı kaybederseniz kart numarası veya satın alma belgenizle bize ulaşın. Dijital kartlar, satın alırken kullanılan e-posta adresine yeniden gönderilebilir.",
          "Kopyalanan, paylaşılan veya hileli şekilde kullanılan kartları devre dışı bırakabiliriz."
        ]],
        ["Şikayetler ve uyuşmazlık çözümü", [
          "Her türlü şikayetinizi {email} adresine gönderebilirsiniz. En kısa sürede yanıt vereceğiz.",
          "Sorunu çözemezsek, Yunanistan Tüketici Ombudsmanı (www.synigoroskatanaloti.gr) gibi alternatif bir uyuşmazlık çözüm kuruluşuna veya yetkili mahkemelere başvurabilirsiniz."
        ]],
        ["Uygulanacak hukuk", [
          "Bu koşullar Yunan hukukuna tabidir. İkamet ettiğiniz ülkenin emredici tüketici koruma kuralları saklı kalmak kaydıyla {court} mahkemeleri yetkilidir."
        ]]
      ]
    },
    el: {
      title: "Όροι πώλησης",
      intro: "Οι παρόντες όροι ισχύουν για κάθε αγορά της κάρτας Lesvos Pass, online ή σε συνεργαζόμενο ταξιδιωτικό πρακτορείο.",
      sections: [
        ["Πωλητής", [
          "{company}, {address}. ΑΦΜ: {vat}. Αριθμός ΓΕΜΗ: {gemi}. Επικοινωνία: {email}, {phone}."
        ]],
        ["Το προϊόν", [
          "Το Lesvos Pass είναι κάρτα προσφορών που παρέχει πρόσβαση σε προσφορές (εκπτώσεις ή κεράσματα) στις συνεργαζόμενες επιχειρήσεις που εμφανίζονται στην ιστοσελίδα μας.",
          "Κάθε κάρτα έχει μοναδικό αριθμό και QR code και δεν αναγράφει το όνομα του κατόχου. Διατίθεται ως ψηφιακή κάρτα (online αγορά) ή ως πλαστική κάρτα (αγορά σε συνεργαζόμενα ταξιδιωτικά πρακτορεία)."
        ]],
        ["Τιμή και πληρωμή", [
          "Η τιμή εμφανίζεται σε ευρώ και περιλαμβάνει ΦΠΑ. Ισχύει η τιμή που εμφανίζεται τη στιγμή της αγοράς.",
          "Οι online πληρωμές διεκπεραιώνονται από ασφαλή πάροχο πληρωμών. Δεν λαμβάνουμε ούτε αποθηκεύουμε τα στοιχεία της κάρτας πληρωμής σας."
        ]],
        ["Παράδοση και ενεργοποίηση", [
          "Ψηφιακή κάρτα: αποστέλλεται στο email που δηλώνετε αμέσως μετά την πληρωμή και ενεργοποιείται τη στιγμή της αγοράς.",
          "Πλαστική κάρτα: ενεργοποιείται από το πρακτορείο τη στιγμή της πώλησης. Κάρτα που δεν έχει ενεργοποιηθεί δεν μπορεί να χρησιμοποιηθεί."
        ]],
        ["Διάρκεια ισχύος", [
          "Η κάρτα ισχύει 3 μήνες από την ημερομηνία αγοράς (για τις πλαστικές κάρτες, από την ημερομηνία ενεργοποίησης στο πρακτορείο). Μετά τη λήξη της δεν έχει καμία αξία."
        ]],
        ["Χρήση της κάρτας", [
          "Δείξτε την κάρτα σας πριν πληρώσετε. Το κατάστημα σκανάρει το QR code και εφαρμόζει την προσφορά. Κάθε προσφορά χρησιμοποιείται μία φορά ανά κατάστημα, εντός του ωραρίου λειτουργίας του και ανάλογα με τη διαθεσιμότητα.",
          "Οι προσφορές δεν εξαργυρώνονται σε μετρητά και δεν συνδυάζονται με άλλες προσφορές, εκτός αν το αποδεχτεί το κατάστημα. Απαγορεύεται η μεταπώληση της κάρτας."
        ]],
        ["Μη επιστροφή χρημάτων και δικαίωμα υπαναχώρησης", [
          "Η κάρτα ενεργοποιείται αμέσως μετά την αγορά. Πριν από την online πληρωμή ζητάτε ρητά την άμεση ενεργοποίησή της και αναγνωρίζετε ότι, στον βαθμό που επιτρέπει η ισχύουσα νομοθεσία για την προστασία του καταναλωτή, χάνετε το δικαίωμα υπαναχώρησης.",
          "Όλες οι αγορές είναι οριστικές και οι κάρτες δεν επιστρέφονται. Αυτό δεν επηρεάζει τα νόμιμα δικαιώματά σας, για παράδειγμα σε περίπτωση λανθασμένης ή διπλής χρέωσης, όπου το ποσό που χρεώθηκε κατά λάθος επιστρέφεται."
        ]],
        ["Το δίκτυο συνεργατών", [
          "Οι συνεργάτες μπορούν να εντάσσονται στο δίκτυο, να αποχωρούν ή να αλλάζουν τις προσφορές τους. Διατηρούμε τη λίστα στην ιστοσελίδα ενημερωμένη. Η κάρτα παρέχει πρόσβαση στο δίκτυο συνεργατών όπως ισχύει κάθε φορά και όχι σε συγκεκριμένο κατάστημα."
        ]],
        ["Απώλεια ή κατάχρηση της κάρτας", [
          "Αν χάσετε την κάρτα σας, επικοινωνήστε μαζί μας με τον αριθμό της κάρτας ή το αποδεικτικό αγοράς. Οι ψηφιακές κάρτες μπορούν να σταλούν ξανά στο email της αγοράς.",
          "Διατηρούμε το δικαίωμα να απενεργοποιούμε κάρτες που αντιγράφονται, κοινοποιούνται ή χρησιμοποιούνται καταχρηστικά."
        ]],
        ["Παράπονα και επίλυση διαφορών", [
          "Μπορείτε να στείλετε κάθε παράπονο στο {email}. Θα σας απαντήσουμε το συντομότερο δυνατό.",
          "Αν δεν επιλυθεί το ζήτημα, μπορείτε να απευθυνθείτε σε φορέα εναλλακτικής επίλυσης διαφορών, όπως ο Συνήγορος του Καταναλωτή (www.synigoroskatanaloti.gr), ή στα αρμόδια δικαστήρια."
        ]],
        ["Εφαρμοστέο δίκαιο", [
          "Οι όροι διέπονται από το ελληνικό δίκαιο. Αρμόδια είναι τα δικαστήρια της {court}, με την επιφύλαξη των αναγκαστικών διατάξεων προστασίας του καταναλωτή της χώρας κατοικίας σας."
        ]]
      ]
    }
  },

  /* ================= PRIVACY AND COOKIES ================= */
  privacy: {
    en: {
      title: "Privacy and cookies",
      intro: "We respect your privacy. This policy explains what personal data we collect, why, and what rights you have under the General Data Protection Regulation (GDPR).",
      sections: [
        ["Data controller", [
          "{company}, {address}. VAT number: {vat}. Contact for data protection questions: {email}."
        ]],
        ["What data we collect", [
          "Purchase: your email address, used to send you the card and the receipt.",
          "Payment: payments are processed by our payment provider. We only receive confirmation of the payment, not your card details.",
          "Card use: when a partner scans your card, we record the card number, the partner and the date and time. This record is not linked to your name.",
          "Communication: the messages and contact details you send us by email or WhatsApp.",
          "Technical data: the website remembers your language choice in your browser. Our hosting provider may keep standard technical logs (such as IP address) for security."
        ]],
        ["Why we use it and on what legal basis", [
          "To deliver the card and provide the service (performance of a contract).",
          "To issue receipts and meet our tax and accounting obligations (legal obligation).",
          "To prevent fraud and to produce anonymous statistics for our partners, such as the number of visits (legitimate interest).",
          "To answer your questions (performance of a contract or your request)."
        ]],
        ["Who we share it with", [
          "Only with providers that help us run the service: payment provider, email delivery service, website hosting and our accountant. Partner businesses only see that a valid card was used, never your email.",
          "Some providers may process data outside the European Economic Area, always with the safeguards required by the GDPR. We never sell your data."
        ]],
        ["How long we keep it", [
          "Purchase and invoicing records: for the period required by tax law.",
          "Card use records: for as long as needed to run the service and for a reasonable period after the card expires, and then they are deleted or anonymised.",
          "Messages: for as long as needed to handle your request."
        ]],
        ["Your rights", [
          "You have the right to access, correct or delete your data, to restrict or object to its processing, and to data portability. To exercise them, contact us at {email}.",
          "You also have the right to lodge a complaint with the Hellenic Data Protection Authority (www.dpa.gr)."
        ]],
        ["Cookies and similar technologies", [
          "The website does not use advertising or tracking cookies. It only stores your language choice in your browser, which is necessary for the website to work as you expect.",
          "The website loads fonts from Google Fonts, which means your browser connects to Google's servers. If we add analytics or other non-essential cookies in the future, we will ask for your consent first."
        ]],
        ["Changes to this policy", [
          "We may update this policy. The date of the latest update is shown at the top of this page."
        ]]
      ]
    },
    tr: {
      title: "Gizlilik ve çerezler",
      intro: "Gizliliğinize saygı duyuyoruz. Bu politika, hangi kişisel verileri neden topladığımızı ve Genel Veri Koruma Tüzüğü (GDPR) kapsamında hangi haklara sahip olduğunuzu açıklar.",
      sections: [
        ["Veri sorumlusu", [
          "{company}, {address}. Vergi numarası: {vat}. Veri koruma soruları için iletişim: {email}."
        ]],
        ["Hangi verileri topluyoruz", [
          "Satın alma: kartı ve makbuzu size göndermek için kullanılan e-posta adresiniz.",
          "Ödeme: ödemeler ödeme sağlayıcımız tarafından işlenir. Yalnızca ödeme onayını alırız, kart bilgilerinizi değil.",
          "Kart kullanımı: bir işletme kartınızı okuttuğunda kart numarasını, işletmeyi ve tarih ile saati kaydederiz. Bu kayıt adınızla ilişkilendirilmez.",
          "İletişim: bize e-posta veya WhatsApp ile gönderdiğiniz mesajlar ve iletişim bilgileri.",
          "Teknik veriler: web sitesi dil tercihinizi tarayıcınızda hatırlar. Barındırma sağlayıcımız güvenlik amacıyla standart teknik kayıtlar (IP adresi gibi) tutabilir."
        ]],
        ["Neden ve hangi hukuki dayanakla kullanıyoruz", [
          "Kartı teslim etmek ve hizmeti sunmak için (sözleşmenin ifası).",
          "Makbuz düzenlemek ve vergi ile muhasebe yükümlülüklerimizi yerine getirmek için (yasal yükümlülük).",
          "Dolandırıcılığı önlemek ve işletmelerimiz için ziyaret sayısı gibi anonim istatistikler oluşturmak için (meşru menfaat).",
          "Sorularınızı yanıtlamak için (sözleşmenin ifası veya talebiniz)."
        ]],
        ["Verileri kimlerle paylaşıyoruz", [
          "Yalnızca hizmeti yürütmemize yardımcı olan sağlayıcılarla: ödeme sağlayıcısı, e-posta gönderim hizmeti, web barındırma ve muhasebecimiz. Anlaşmalı işletmeler yalnızca geçerli bir kartın kullanıldığını görür, e-posta adresinizi asla görmez.",
          "Bazı sağlayıcılar verileri Avrupa Ekonomik Alanı dışında işleyebilir; bu durumda her zaman GDPR'ın gerektirdiği güvenceler uygulanır. Verilerinizi asla satmayız."
        ]],
        ["Ne kadar süre saklıyoruz", [
          "Satın alma ve fatura kayıtları: vergi mevzuatının gerektirdiği süre boyunca.",
          "Kart kullanım kayıtları: hizmetin yürütülmesi için gerektiği sürece ve kartın süresi dolduktan sonra makul bir süre boyunca; ardından silinir veya anonim hale getirilir.",
          "Mesajlar: talebinizi yanıtlamak için gerektiği sürece."
        ]],
        ["Haklarınız", [
          "Verilerinize erişme, bunları düzeltme veya silme, işlenmesini kısıtlama veya itiraz etme ve veri taşınabilirliği haklarına sahipsiniz. Bu hakları kullanmak için {email} adresinden bize ulaşın.",
          "Ayrıca Yunanistan Kişisel Verileri Koruma Kurumuna (www.dpa.gr) şikayette bulunma hakkına sahipsiniz."
        ]],
        ["Çerezler ve benzeri teknolojiler", [
          "Web sitesi reklam veya izleme çerezleri kullanmaz. Yalnızca dil tercihinizi tarayıcınızda saklar; bu, sitenin beklediğiniz şekilde çalışması için gereklidir.",
          "Web sitesi yazı tiplerini Google Fonts'tan yükler; bu, tarayıcınızın Google sunucularına bağlandığı anlamına gelir. Gelecekte analiz veya zorunlu olmayan başka çerezler eklersek, önce onayınızı isteyeceğiz."
        ]],
        ["Bu politikadaki değişiklikler", [
          "Bu politikayı güncelleyebiliriz. Son güncelleme tarihi sayfanın üst kısmında gösterilir."
        ]]
      ]
    },
    el: {
      title: "Απόρρητο και cookies",
      intro: "Σεβόμαστε την ιδιωτικότητά σας. Η παρούσα πολιτική εξηγεί ποια προσωπικά δεδομένα συλλέγουμε, για ποιο σκοπό και ποια δικαιώματα έχετε σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (ΓΚΠΔ).",
      sections: [
        ["Υπεύθυνος επεξεργασίας", [
          "{company}, {address}. ΑΦΜ: {vat}. Επικοινωνία για θέματα προστασίας δεδομένων: {email}."
        ]],
        ["Ποια δεδομένα συλλέγουμε", [
          "Αγορά: τη διεύθυνση email σας, για να σας στείλουμε την κάρτα και την απόδειξη.",
          "Πληρωμή: οι πληρωμές διεκπεραιώνονται από τον πάροχο πληρωμών. Λαμβάνουμε μόνο την επιβεβαίωση της πληρωμής, όχι τα στοιχεία της κάρτας σας.",
          "Χρήση της κάρτας: όταν ένα κατάστημα σκανάρει την κάρτα σας, καταγράφουμε τον αριθμό της κάρτας, το κατάστημα, την ημερομηνία και την ώρα. Η καταγραφή δεν συνδέεται με το όνομά σας.",
          "Επικοινωνία: τα μηνύματα και τα στοιχεία επικοινωνίας που μας στέλνετε με email ή WhatsApp.",
          "Τεχνικά δεδομένα: η ιστοσελίδα θυμάται τη γλώσσα που επιλέξατε στον browser σας. Ο πάροχος φιλοξενίας ενδέχεται να τηρεί τυπικά τεχνικά αρχεία (όπως τη διεύθυνση IP) για λόγους ασφαλείας."
        ]],
        ["Για ποιο σκοπό και με ποια νομική βάση", [
          "Για την παράδοση της κάρτας και την παροχή της υπηρεσίας (εκτέλεση σύμβασης).",
          "Για την έκδοση αποδείξεων και την τήρηση των φορολογικών και λογιστικών υποχρεώσεών μας (νομική υποχρέωση).",
          "Για την πρόληψη της απάτης και την παραγωγή ανώνυμων στατιστικών για τους συνεργάτες μας, όπως ο αριθμός των επισκέψεων (έννομο συμφέρον).",
          "Για να απαντάμε στις ερωτήσεις σας (εκτέλεση σύμβασης ή δικό σας αίτημα)."
        ]],
        ["Με ποιους τα μοιραζόμαστε", [
          "Μόνο με παρόχους που μας βοηθούν να λειτουργεί η υπηρεσία: πάροχο πληρωμών, υπηρεσία αποστολής email, φιλοξενία της ιστοσελίδας και τον λογιστή μας. Τα συνεργαζόμενα καταστήματα βλέπουν μόνο ότι χρησιμοποιήθηκε έγκυρη κάρτα, ποτέ το email σας.",
          "Ορισμένοι πάροχοι ενδέχεται να επεξεργάζονται δεδομένα εκτός του Ευρωπαϊκού Οικονομικού Χώρου, πάντα με τις εγγυήσεις που απαιτεί ο ΓΚΠΔ. Δεν πουλάμε ποτέ τα δεδομένα σας."
        ]],
        ["Για πόσο τα διατηρούμε", [
          "Στοιχεία αγορών και τιμολόγησης: για το διάστημα που ορίζει η φορολογική νομοθεσία.",
          "Καταγραφές χρήσης καρτών: όσο χρειάζεται για τη λειτουργία της υπηρεσίας και για εύλογο διάστημα μετά τη λήξη της κάρτας, και στη συνέχεια διαγράφονται ή ανωνυμοποιούνται.",
          "Μηνύματα: όσο χρειάζεται για τη διεκπεραίωση του αιτήματός σας."
        ]],
        ["Τα δικαιώματά σας", [
          "Έχετε δικαίωμα πρόσβασης, διόρθωσης και διαγραφής των δεδομένων σας, περιορισμού ή εναντίωσης στην επεξεργασία τους, καθώς και φορητότητας. Για να τα ασκήσετε, επικοινωνήστε μαζί μας στο {email}.",
          "Έχετε επίσης δικαίωμα να υποβάλετε καταγγελία στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (www.dpa.gr)."
        ]],
        ["Cookies και παρόμοιες τεχνολογίες", [
          "Η ιστοσελίδα δεν χρησιμοποιεί cookies διαφήμισης ή παρακολούθησης. Αποθηκεύει μόνο την επιλογή γλώσσας στον browser σας, κάτι απαραίτητο για να λειτουργεί η σελίδα όπως περιμένετε.",
          "Η ιστοσελίδα φορτώνει γραμματοσειρές από το Google Fonts, κάτι που σημαίνει ότι ο browser σας συνδέεται με διακομιστές της Google. Αν στο μέλλον προσθέσουμε στατιστικά ή άλλα μη απαραίτητα cookies, θα ζητήσουμε πρώτα τη συγκατάθεσή σας."
        ]],
        ["Αλλαγές στην πολιτική", [
          "Ενδέχεται να ενημερώνουμε την παρούσα πολιτική. Η ημερομηνία της τελευταίας ενημέρωσης εμφανίζεται στην κορυφή της σελίδας."
        ]]
      ]
    }
  }
};
