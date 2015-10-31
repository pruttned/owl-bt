Tabula:
- Budu definovane zakladne typy (int, float, ...)
	- Je to nutne kvoli UT blackboard  based condition kde sa mu podla daneho typu spravi editor a tiez typy podmienok (less then a tak)
- Okrem zakladnych typov budu este podporovane :
	- *Entity* - predstavuje ukazovatel na entitu v scene definovanu menom
		- Bude vyzadovane aby vedel engine poskytnut resolver,,ktory na zaklade mena vrati entiu. Ukladat sa bude len meno
	- *Struct* - predstavuje napr. vektor a ine custom struktury
		- Z hladiska ulozenia bude musiet engine poskytnut serializer, ktory bude vediet strukturu ulozit do json a opacne nacitat strukturu z daneho json.
		- samotne ulozenie v tabuli v runtime bude musiet byt bez boxovania.. cize nieco ako:
	- *Enum* - bude sluzit napr. na definovane typu cielu - vidim priatela? nepriatela? neutralneho?
		- bude nutne vediet pre dany typ definovat zoznam hodnot - meno,hodnota(int)
		- V runtime to pri najhorsom moze byt kludne ukladane a vracane do engine len ako int a v engine si to uz clovek pretypuje ako potrebuje.

```cs
class StructTable<T> : IStructTable : where T : struct ?? (neviem ci ide taky where.. niec opodobne som uz robil)
{
	Dictionary<stgring, T> values;

	T Get(nane)
}


Table
{
	Dict<type, IStructTable> mStructTables;

T get<T>(name)
{
	var structTable = (StructProvider<T>)mStructTables[typeof(T)]()
	return structTable.get();
}

}

table.get<Vector3>('ddd')
table.set<Vector3>(...)

pozrie ci uz ma taky structprovider a ak nie tak ho prida a tak dalej...
```


- Bolo by vhodne aby sa fieldy v rabuli nereferencovali len na zaklade mena, ale skor na zakalde nejakeho id, aby sa umoznilo zmenit meno v prvku  vtabuli bez toho aby som potom rucne prechadzal vsetky uzly v strome a fixoval ich.



## Podstromy a tabula

- Medzi tabulou a stromom bude 1:1 vazba
- Pristupovanie k parametrom tabule v podstrome sa bude robit cez 2-way binding hodnot tabule v `Run Behavior` node. Cize:
	- V podstrome si zadefinujem nejaku premenu v tabuli.
	- V hlavnom strome si pridam `Run Behavior` nodu a vyberiem si strom
	- V jej nastaveniach sa mi objavia parametre z podstromu
	- Pre kazdy parameter ktory chcem si vyberiem parameter z mojej hlavnej tabule
	- V hre to bude potom fungovat ako 2-way binding, cize ked podstrom zmeni hodnotu, tak sa mi zmena premietne do premennej v hlavnom strome a opacne.
- V hre bude vediet pristupovat len k premennym v hlavnom strome. Cize ak chcem z hry pristupovat k nejakej premennej v podstrome, tak si ju musime naviazat na premennu v hlavnom strome
- Stoji za uvazenie private parametre. Mozu sluzit na to, aby clovek vedel ake parametre ma nastavovat podstromu. V takomto pripade ale moze platit, ze by mal mat moznost spravit overide aby sa vedel naviazat aj na privatne propery napr. ak k nim chce pristupovat v hre.
