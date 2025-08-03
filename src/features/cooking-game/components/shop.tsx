import { useState } from "react";
import styles from "./shop.module.css";
import { getIngredientImage } from "$/utils";

interface InventoryItem {
  name: string;
  quantity: string;
  image: string;
}

interface MarketItem {
  name: string;
  price: number;
  image: string;
}

const inventoryData: InventoryItem[] = [
  { name: "морковки", quantity: "3", image: getIngredientImage("морковь") },
  { name: "помидоры", quantity: "2", image: getIngredientImage("помидор") },
  { name: "огурец", quantity: "1", image: getIngredientImage("огурец") },
  { name: "лук", quantity: "2", image: getIngredientImage("лук") },
  { name: "картофель", quantity: "4", image: getIngredientImage("картофель") },
  { name: "яйца", quantity: "6", image: getIngredientImage("яйца") },
];

const marketData: MarketItem[] = [
  { name: "морковь", price: 15, image: getIngredientImage("морковь") },
  { name: "помидор", price: 25, image: getIngredientImage("помидор") },
  { name: "огурец свежий", price: 20, image: getIngredientImage("огурец свежий") },
  { name: "огурец маринованный", price: 18, image: getIngredientImage("огурец маринованный") },
  { name: "лук", price: 12, image: getIngredientImage("лук") },
  { name: "лук репчатый", price: 10, image: getIngredientImage("лук репчатый") },
  { name: "картофель", price: 30, image: getIngredientImage("картофель") },
  { name: "пюре картофельное", price: 45, image: getIngredientImage("пюре картофельное") },
  { name: "яйцо", price: 8, image: getIngredientImage("яйцо") },
  { name: "мука", price: 35, image: getIngredientImage("мука") },
  { name: "тесто сладкое", price: 55, image: getIngredientImage("тесто сладкое") },
  { name: "сахар", price: 28, image: getIngredientImage("сахар") },
  { name: "соль", price: 8, image: getIngredientImage("соль") },
  { name: "перец", price: 35, image: getIngredientImage("перец") },
  { name: "специи", price: 42, image: getIngredientImage("специи") },
  { name: "масло растительное", price: 45, image: getIngredientImage("масло растительное") },
  { name: "масло сливочное", price: 80, image: getIngredientImage("масло сливочное") },
  { name: "масло топленое", price: 95, image: getIngredientImage("масло топленое") },
  { name: "молоко", price: 55, image: getIngredientImage("молоко") },
  { name: "кефир", price: 48, image: getIngredientImage("кефир") },
  { name: "сметана", price: 65, image: getIngredientImage("сметана") },
  { name: "сливки", price: 75, image: getIngredientImage("сливки") },
  { name: "творог", price: 85, image: getIngredientImage("творог") },
  { name: "майонез", price: 38, image: getIngredientImage("майонез") },
  { name: "курица", price: 150, image: getIngredientImage("курица") },
  { name: "говядина", price: 200, image: getIngredientImage("говядина") },
  { name: "свинина", price: 180, image: getIngredientImage("свинина") },
  { name: "баранина", price: 220, image: getIngredientImage("баранина") },
  { name: "фарш", price: 160, image: getIngredientImage("фарш") },
  { name: "рыба", price: 180, image: getIngredientImage("рыба") },
  { name: "колбаса", price: 120, image: getIngredientImage("колбаса") },
  { name: "салями", price: 140, image: getIngredientImage("салями") },
  { name: "рис", price: 40, image: getIngredientImage("рис") },
  { name: "хлеб белый", price: 22, image: getIngredientImage("хлеб белый") },
  { name: "чеснок", price: 18, image: getIngredientImage("чеснок") },
  { name: "зелень", price: 25, image: getIngredientImage("зелень") },
  { name: "лимон", price: 25, image: getIngredientImage("лимон") },
  { name: "яблоко", price: 32, image: getIngredientImage("яблоко") },
  { name: "грибы", price: 85, image: getIngredientImage("грибы") },
  { name: "редис", price: 28, image: getIngredientImage("редис") },
  { name: "изюм", price: 95, image: getIngredientImage("изюм") },
  { name: "оливки", price: 110, image: getIngredientImage("оливки") },
  { name: "капуста квашеная", price: 35, image: getIngredientImage("капуста квашеная") },
  { name: "уксус", price: 15, image: getIngredientImage("уксус") },
  { name: "горчица", price: 22, image: getIngredientImage("горчица") },
  { name: "лавровый лист", price: 12, image: getIngredientImage("лавровый лист") },
  { name: "мускатный орех", price: 45, image: getIngredientImage("мускатный орех") },
  { name: "мята", price: 38, image: getIngredientImage("мята") },
  { name: "суп", price: 75, image: getIngredientImage("суп") },
];

// Функция для разделения массива на страницы по 6 элементов
const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const Shop = () => {
  const [inventoryPage, setInventoryPage] = useState(0);
  const [marketPage, setMarketPage] = useState(0);

  // Разделяем данные на страницы по 6 элементов (2 ряда по 3)
  const inventoryPages = chunkArray(inventoryData, 6);
  const marketPages = chunkArray(marketData, 6);

  const handleInventoryPageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && inventoryPage > 0) {
      setInventoryPage(inventoryPage - 1);
    } else if (direction === 'next' && inventoryPage < inventoryPages.length - 1) {
      setInventoryPage(inventoryPage + 1);
    }
  };

  const handleMarketPageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && marketPage > 0) {
      setMarketPage(marketPage - 1);
    } else if (direction === 'next' && marketPage < marketPages.length - 1) {
      setMarketPage(marketPage + 1);
    }
  };

  const currentInventoryItems = inventoryPages[inventoryPage] || [];
  const currentMarketItems = marketPages[marketPage] || [];

  return (
    <div className={styles.book}>
      <div className={styles.page}>
        <div className={styles.pageContent}>
          <h2 className={styles.pageTitle}>Инвентарь</h2>

          <div className={styles.itemsContainer}>
            <div className={styles.itemsRow}>
              {currentInventoryItems.slice(0, 3).map((item, idx) => (
                <div key={idx} className={styles.itemWrapper}>
                  <div className={styles.itemIcon}>
                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                  </div>
                  <span className={styles.itemLabel}>{item.quantity} {item.name}</span>
                </div>
              ))}
            </div>
            <div className={styles.itemsRow}>
              {currentInventoryItems.slice(3, 6).map((item, idx) => (
                <div key={idx + 3} className={styles.itemWrapper}>
                  <div className={styles.itemIcon}>
                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                  </div>
                  <span className={styles.itemLabel}>{item.quantity} {item.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.navigation}>
            <button 
              className={styles.navButton}
              onClick={() => handleInventoryPageChange('prev')}
              disabled={inventoryPage === 0}
            >
              <span className={styles.chevron}>‹</span>
            </button>
            <span className={styles.pageInfo}>
              {inventoryPage + 1} / {inventoryPages.length}
            </span>
            <button 
              className={styles.navButton}
              onClick={() => handleInventoryPageChange('next')}
              disabled={inventoryPage === inventoryPages.length - 1}
            >
              <span className={styles.chevron}>›</span>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.page}>
        <div className={styles.pageContent}>
          <h2 className={styles.pageTitle}>Маркет</h2>

          <div className={styles.itemsContainer}>
            <div className={styles.itemsRow}>
              {currentMarketItems.slice(0, 3).map((item, idx) => (
                <div key={idx} className={styles.itemWrapper}>
                  <div className={styles.itemIcon}>
                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                  </div>
                  <span className={styles.itemLabel}>{item.name}</span>
                  <span className={styles.itemPrice}>{item.price} ₽</span>
                  <button className={styles.buyButton}>КУПИТЬ</button>
                </div>
              ))}
            </div>
            <div className={styles.itemsRow}>
              {currentMarketItems.slice(3, 6).map((item, idx) => (
                <div key={idx + 3} className={styles.itemWrapper}>
                  <div className={styles.itemIcon}>
                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                  </div>
                  <span className={styles.itemLabel}>{item.name}</span>
                  <span className={styles.itemPrice}>{item.price} ₽</span>
                  <button className={styles.buyButton}>КУПИТЬ</button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.navigation}>
            <button 
              className={styles.navButton}
              onClick={() => handleMarketPageChange('prev')}
              disabled={marketPage === 0}
            >
              <span className={styles.chevron}>‹</span>
            </button>
            <span className={styles.pageInfo}>
              {marketPage + 1} / {marketPages.length}
            </span>
            <button 
              className={styles.navButton}
              onClick={() => handleMarketPageChange('next')}
              disabled={marketPage === marketPages.length - 1}
            >
              <span className={styles.chevron}>›</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
