// Angular
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location, DecimalPipe } from '@angular/common';
// Material
import { MatDialog } from '@angular/material';
// RxJS
import { Observable, BehaviorSubject, Subscription, of } from 'rxjs';
import { map, startWith, delay, first} from 'rxjs/operators';
// NGRX
import { Store, select } from '@ngrx/store';
import { Dictionary, Update } from '@ngrx/entity';
import { AppState } from '../../../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../../../core/_base/layout';
// CRUD
import { LayoutUtilsService, TypesUtilsService, MessageType, HttpUtilsService } from '../../../../../../core/_base/crud';
// Services and Models
import {
	selectLastCreatedBarangId,
	selectBarangById,
	BarangModel,
	BarangOnServerCreated,
	BarangUpdated,
	BarangService,
	CategoryService,
	BrandService,
	barangsReducer,
	OneImageDeleted
} from '../../../../../../core/catalog';
import { HttpEvent } from '@angular/common/http';
import { find } from 'lodash';
import { AngularEditorConfig } from '@kolkov/angular-editor';

const AVAILABLE_COLORS: string[] =
	['Red', 'CadetBlue', 'Gold', 'LightSlateGrey', 'RoyalBlue', 'Crimson', 'Blue', 'Sienna', 'Indigo', 'Green', 'Violet',
	'GoldenRod', 'OrangeRed', 'Khaki', 'Teal', 'Purple', 'Orange', 'Pink', 'Black', 'DarkTurquoise'];
/*
const AVAILABLE_MANUFACTURES: string[] =
	['Pontiac', 'Subaru', 'Mitsubishi', 'Oldsmobile', 'Chevrolet', 'Chrysler', 'Suzuki', 'GMC', 'Cadillac', 'Mercury', 'Dodge',
	'Ram', 'Lexus', 'Lamborghini', 'Honda', 'Nissan', 'Ford', 'Hyundai', 'Saab', 'Toyota'];
*/
@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-product-edit',
	templateUrl: './product-edit.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [DecimalPipe]
})
export class ProductEditComponent implements OnInit, OnDestroy {
	// Public properties
	barang: BarangModel;
	barangId$: Observable<number>;
	oldBarang: BarangModel;
	selectedTab: number = 0;
	loadingSubject = new BehaviorSubject<boolean>(true);
	loading$: Observable<boolean>;
	barangForm: FormGroup;
	hasFormErrors: boolean = false;
	hasBrandErrors: boolean = false;
	availableYears: number[] = [];
	filteredColors: Observable<string[]>;
	filteredManufactures: Observable<string[]>;
	imageUrl: string = '/assets/img/default-image.png';
	fileToUpload: File = null;
	public isEditMode: boolean = true;
	lastFileAt: Date;
	files: File[] = [];
	file: File[] = [];
	variant: any[] = [];
	interval: any;
	cover: any;
	brand: any = [];
	public brandFil: any = [];
	brandAll: Observable<any>;
	brand$: Observable<any[]>;
	brandHasil: any;
	brandName = '';
	progress: number;
	hasBaseDropZoneOver: boolean = false;
	httpEmitter: Subscription;
	httpEvent: HttpEvent<{}>;
	sendableFormData: FormData;
	// Private password
	private componentSubscriptions: Subscription;
	// sticky portlet header margin
	private headerMargin: number;
	products: BarangModel[] = [];
	hasSlugErrors: boolean = false;
	editorConfig: AngularEditorConfig = {
		editable: true,
		spellcheck: true,
		 height: '200px',
		 minHeight: '0',
		 maxHeight: '200px',
		 width: 'auto',
		 minWidth: '0',
		 translate: 'yes',
		 enableToolbar: true,
		 showToolbar: true,
		 placeholder: 'Enter text here...',
		 defaultParagraphSeparator: '',
		 defaultFontName: '',
		 defaultFontSize: '',
		 fonts: [
			{class: 'arial', name: 'Arial'},
			{class: 'times-new-roman', name: 'Times New Roman'},
			{class: 'calibri', name: 'Calibri'},
			{class: 'comic-sans-ms', name: 'Comic Sans MS'}
		 ],
		 customClasses: [
		 {
			name: 'quote',
			class: 'quote',
		 },
		 {
			name: 'redText',
			class: 'redText'
		 },
		 {
			name: 'titleText',
			class: 'titleText',
			tag: 'h1',
		 },
		],
		uploadUrl: 'v1/image',
		sanitize: true,
		toolbarPosition: 'top',
	};
	localURl: string;

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param typesUtilsService: TypesUtilsService
	 * @param barangFB: FormBuilder
	 * @param dialog: MatDialog
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: SubheaderService
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(
		private store: Store<AppState>,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private typesUtilsService: TypesUtilsService,
		private barangFB: FormBuilder,
		public dialog: MatDialog,
		private subheaderService: SubheaderService,
		private layoutUtilsService: LayoutUtilsService,
		private layoutConfigService: LayoutConfigService,
		private barangService: BarangService,
		private categoryService: CategoryService,
		private brandService: BrandService,
		private location: Location,
		private _decimalPipe: DecimalPipe,
		private domainLocal: HttpUtilsService) {
			this.localURl = this.domainLocal.domain;
			this.activatedRoute.params.subscribe(params => {
				const id = params['id'];
				if (id && id > 0) {
					this.store.pipe(
						select(selectBarangById(id)),
						first(res => {
							return res !== undefined;
						})
					).subscribe(result => {
						this.imageUrl = '/assets/img/product/' + (result.image);
						this.variantImage(result.id);
					});
					// console.log(this.barang.id);
				}
				});
				this.category$ = this.categoryService.AllCategories();
				/*
				this.categoryService.AllCategories().subscribe(
					res => {this.category = res; },
					err => console.error(err)
				);
				*/
				// this.brandAll = this.brandService.AllBrands();

				this.brandService.getAllBrands().subscribe(
					res => {this.brand = res; },
					err => console.error(err)
				);

		}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */

	category$: Observable<any[]>;

	sum: any = [];

	images: any = [];

	calculate(width: number, height: number, depth: number) {
		this.sum = ((+width / 10) * (+height / 10) * (+depth / 10) / 6000) * 1000;
		this.barangForm.controls['weight'].setValue(this._decimalPipe.transform(this.sum, '1.0-0'));
	}

	ngOnInit() {
		// console.log(this.brandHasil);
		this.barangService.getAllBarangs().subscribe(
			result => {
				this.products = result;
			}
		);

		this.loading$ = this.loadingSubject.asObservable();
		this.loadingSubject.next(true);
		this.activatedRoute.params.subscribe(params => {
			const id = params['id'];
			if (id && id > 0) {
				this.store.pipe(
					select(selectBarangById(id)),
					first(res => {
						return res !== undefined;
					})
				).subscribe(result => {
					this.barang = result;
					// console.log(result);
					this.barangId$ = of(result.id);
					this.oldBarang = Object.assign({}, result);
					this.imageUrl = '/assets/img/product/' + (result.image);
					/*
					this.brandAll.subscribe(
						res => {
							this.brandFil = res;
							console.log(this.brandFil);
						}
					);
					*/
					// this.brandName = this.brandFil.filter(option => option.id.toLowerCase().includes(this.barang.id_brand));
					// console.log(this.barang);
					// console.log(this.brandFil);
					// console.log(this.barang);
					this.initBarang();
				});
				// console.log(this.barang.id);
			}
			});

		// sticky portlet header
		window.onload = () => {
			const style = getComputedStyle(document.getElementById('kt_header'));
			this.headerMargin = parseInt(style.height, 0);
		};
		this.barangService.getAllImages(this.barang.id).subscribe(
			res => {
				this.images = res;
				if (this.images > 0) {
					this.show();
				}
				if (this.images < 0 ) {
					this.hide();
				}
				// console.log(this.images);
			},
			err => console.error(err)
		);
	}

	variantImage(id) {
		this.barangService.coverParams(id).subscribe(
			result => {
				this.cover = result;
				// console.log(this.cover);
			}
		);
		// this.variant$ = this.barangService.getAllImagesByID(id);
		// this.interval = setInterval(() => {
			// this.variant$ = this.barangService.getAllImagesByID(id);
		// }, 2000);
		// console.log(this.variant$);

		this.barangService.getAllImagesByID(id).subscribe(
			result => {
				this.variant = result;
				// console.log(this.variant);
			}
		);

	}

	show() {
		this.isEditMode = true;
	}

	hide() {
		this.isEditMode = false;
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}

	handleFileInput(files: FileList) {
		this.fileToUpload = files.item(0);

		// Show image preview
		let reader = new FileReader();
		reader.onload = (event: any) => {
			this.imageUrl = event.target.result;
		};
		reader.readAsDataURL(this.fileToUpload);
	}

	getDate() {
		return new Date();
	}

	/**
	 * Init barang
	 */
	initBarang() {
		this.createForm();
		const prefix = this.layoutConfigService.getCurrentMainRoute();
		this.loadingSubject.next(false);
		if (!this.barang.id) {
			this.subheaderService.setBreadcrumbs([
				{ title: 'Catalog', page: `../${prefix}/catalog` },
				{ title: 'Product',  page: `../${prefix}/catalog/product` },
				{ title: 'Create product', page: `../${prefix}/catalog/product/add` }
			]);
			return;
		}
		this.subheaderService.setTitle('Edit product');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Catalog', page: `../${prefix}/catalog` },
			{ title: 'Product',  page: `../${prefix}/catalog/product` },
			{ title: 'Edit product', page: `../${prefix}/catalog/product/edit`, queryParams: { id: this.barang.id } }
		]);
	}

	/**
	 * Create form
	 */
	createForm() {
		this.barangForm = this.barangFB.group({
			image: [this.barang.image],
			barcode: [this.barang.barcode, Validators.required],
			name: [this.barang.name, Validators.required],
			id_category: [this.barang.id_category.toString(), Validators.required],
			id_brand: [this.barang.Bname],
			summary: [this.barang.summary],
			slug: [this.barang.slug_url],
			description: [this.barang.description],
			stock: [this.barang.stock, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
			price: [this.barang.price, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
			color: [this.barang.color],
			youtube: [this.barang.video],
			nic: [this.barang.nic],
			status: [this.barang.status.toString(), [Validators.required, Validators.min(0), Validators.max(1)]],
			kondisi: [this.barang.kondisi.toString(), [Validators.required]],
			home: [this.barang.home.toString(), [Validators.required, Validators.min(0), Validators.max(1)]],
			width: [this.barang.width, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
			height: [this.barang.height, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
			depth: [this.barang.depth, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
			weight: [this.barang.weight, Validators.required]
		});

		this.brand$ = this.barangForm.controls.id_brand.valueChanges
			.pipe(
				startWith(''),
				map(val => this.filterBrand(val))
			);

		this.filteredColors = this.barangForm.controls.color.valueChanges
			.pipe(
				startWith(''),
				map(val => this.filterColor(val.toString()))
		);

	}

	/**
	 * Filter Brand
	 *
	 * @param val: string
	 */

	filterBrand(val: string): string[] {
		const filterValue = val.toLowerCase();
		const filBrand = this.brand.filter(option => option.name.toLowerCase().includes(filterValue));
		if (filBrand.length > 0) {
			this.brandHasil = filBrand;
		} else {
			this.brandName = val.toUpperCase();
		}
		console.log(this.brandName, this.brandHasil);
		return this.brand.filter(option => option.name.toLowerCase().includes(filterValue));
	}

	/**
	 * Filter color
	 *
	 * @param val: string
	 */

	filterColor(val: string): string[] {
		return AVAILABLE_COLORS.filter(option =>
			option.toLowerCase().includes(val.toLowerCase()));
	}

	/**
	 * Go back to the list
	 *
	 * @param id: any
	 */
	goBack(id) {
		this.loadingSubject.next(false);
		const url = `${this.layoutConfigService.getCurrentMainRoute()}/catalog/categories?id=${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Refresh barang
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshBarang(isNew: boolean = false, id = 0) {
		this.loadingSubject.next(false);
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `${this.layoutConfigService.getCurrentMainRoute()}/catalog/product/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Reset
	 */
	reset() {
		this.barang = Object.assign({}, this.oldBarang);
		this.createForm();
		this.hasFormErrors = false;
		this.hasBrandErrors = false;
		this.barangForm.markAsPristine();
		this.barangForm.markAsUntouched();
		this.barangForm.updateValueAndValidity();
	}

	backPage() {
		this.location.back();
	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSumbit(withBack: boolean = false) {
		this.hasFormErrors = false;
		this.hasBrandErrors = false;
		const controls = this.barangForm.controls;

		// console.log(controls);

		const slash = '/';
		const titik = ':';
		const barcode = controls['barcode'].value.toLowerCase();
		const filterName = controls['name'].value.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(new RegExp(slash, 'g'), '')
		.replace(new RegExp(titik, 'g'), '')
		.replace(/\-\-+/g, '-');
		const filterColor = controls['color'].value.replace(/\s+/g, '-').toLowerCase();
		const filterNic = controls['nic'].value.replace(/\s+/g, '-').toLowerCase();
		if (controls['nic'].value === '') {
			controls['slug'].setValue(filterName + '-' + filterColor);
		} else if (controls['color'].value === '') {
			controls['slug'].setValue(filterName + '-' + filterNic);
		} else if (controls['color'].value === '' && controls['nic'].value === '') {
			controls['slug'].setValue(filterName + '-' + barcode);
		} else {
			controls['slug'].setValue(filterName + '-' + barcode);
		}

		/** check form */
		if (this.barangForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		console.log(this.barang.Bname, controls['id_brand'].value);

		// tslint:disable-next-line: max-line-length
		if (controls['id_brand'].value === null || controls['id_brand'].value === 'null') {
			this.hasBrandErrors = true;
			return;
		}

		/** check brand
		if (this.brandHasil.length === 0) {
			this.hasBrandErrors = true;
			return;
		}
		*/

		const barang = find(this.products, function(item: BarangModel) {
			// tslint:disable-next-line: max-line-length
			return (item.slug_url === controls['slug'].value);
		});

		if (barang) {
			controls['slug'].setValue(controls['slug'].value + '-' + barcode);
			const check = find(this.products, function(item: BarangModel) {
				// tslint:disable-next-line: max-line-length
				return (item.slug_url === controls['slug'].value);
			});

			if (check) {
				controls['slug'].setValue(barang.slug_url);
			} else {
				controls['slug'].setValue(barang.slug_url);
			}
		}

		if (this.brandName !== '') {
			console.log(this.brandName);
			this.insertNewbrandA();

			return;
		}

		// tslint:disable-next-line:prefer-const
		let editedBarang = this.prepareBarang();
		let dataForm = this.makeFormData(editedBarang);
		this.updateBarang(dataForm);
		return;

	}

	onSave(withBack: boolean = false) {
		this.hasFormErrors = false;
		this.hasBrandErrors = false;
		const controls = this.barangForm.controls;

		const slash = '/';
		const titik = ':';
		const barcode = controls['barcode'].value.toLowerCase();
		const filterName = controls['name'].value.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(new RegExp(slash, 'g'), '')
		.replace(new RegExp(titik, 'g'), '')
		.replace(/\-\-+/g, '-');
		const filterColor = controls['color'].value.replace(/\s+/g, '-').toLowerCase();
		const filterNic = controls['nic'].value.replace(/\s+/g, '-').toLowerCase();
		if (controls['nic'].value === '') {
			controls['slug'].setValue(filterName + '-' + filterColor);
		} else if (controls['color'].value === '') {
			controls['slug'].setValue(filterName + '-' + filterNic);
		} else if (controls['color'].value === '' && controls['nic'].value === '') {
			controls['slug'].setValue(filterName + '-' + barcode);
		} else {
			controls['slug'].setValue(filterName + '-' + barcode);
		}

		/** check form */
		if (this.barangForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		/** check brand
		if (this.brandHasil.length === 0) {
			this.hasBrandErrors = true;
			return;
		}
		*/



		const barang = find(this.products, function(item: BarangModel) {
			// tslint:disable-next-line: max-line-length
			return (item.slug_url === controls['slug'].value);
		});

		if (barang) {
			controls['slug'].setValue(controls['slug'].value + '-' + barcode);
			const check = find(this.products, function(item: BarangModel) {
				// tslint:disable-next-line: max-line-length
				return (item.slug_url === controls['slug'].value);
			});

			if (check) {
				controls['slug'].setValue(barang.slug_url);
			} else {
				controls['slug'].setValue(barang.slug_url);
			}
		}

		if (this.brandName !== '') {
			console.log(this.brandName);
			this.insertNewbrandB();

			return;
		}

		let editedBarang1 = this.prepareBarang1();
		let dataForm1 = this.makeFormData1(editedBarang1);
		this.updateBarang1(dataForm1);
		return;


	}

	/**
	 * Insert New Brand
	 */
	insertNewbrandA() {

		const newBrand = {
			image: 'no_brand.png',
			name: this.brandName,
			description: ''
		};
		this.brandService.BrandAuto(newBrand).subscribe(
			res => {
				this.brandHasil = res;
				let editedBarang = this.prepareBarang();
				let dataForm = this.makeFormData(editedBarang);
				this.updateBarang(dataForm);
				return;
			}
		);
	}

	insertNewbrandB() {

		const newBrand = {
			image: 'no_brand.png',
			name: this.brandName,
			description: ''
		};
		this.brandService.BrandAuto(newBrand).subscribe(
			res => {
				this.brandHasil = res;
				let editedBarang1 = this.prepareBarang1();
				let dataForm1 = this.makeFormData1(editedBarang1);
				this.updateBarang1(dataForm1);
				return;
			}
		);
	}

	/**
	 * Returns object for saving
	 */
	prepareBarang(): BarangModel {
		const controls = this.barangForm.controls;
		const _barang = new BarangModel();
		const kondisi: string = controls['kondisi'].value;
		_barang.id = this.barang.id;
		_barang.barcode = controls['barcode'].value;
		_barang.name = controls['name'].value;
		_barang.id_category = +controls['id_category'].value;
		// tslint:disable-next-line: max-line-length
		if (!this.brandHasil) {
			console.log('2', this.brandHasil, this.brandName);
			_barang.id_brand = this.barang.id_brand;
		} else {
			console.log('3', this.brandHasil[0].id, this.brandName);
			_barang.id_brand = +this.brandHasil[0].id;
		}
		_barang.summary = controls['summary'].value;
		_barang.description = controls['description'].value;
		_barang.stock = controls['stock'].value;
		_barang.price = controls['price'].value;
		_barang.color = controls['color'].value;
		_barang.video = controls['youtube'].value;
		_barang.status = +controls['status'].value;
		_barang.nic = controls['nic'].value;
		if (kondisi === 'Regular') {
			_barang.kondisi = '2';
		} else if (kondisi === 'BestSeller') {
			_barang.kondisi = '3';
		} else {
			_barang.kondisi = '4';
		}
		_barang.home = +controls['home'].value;
		_barang.width = controls['width'].value;
		_barang.height = controls['height'].value;
		_barang.depth = controls['depth'].value;
		_barang.weight = controls['weight'].value;
		// _barang.slug = controls['slug'].value;
		// _barang.image = this.fileToUpload;
		return _barang;
	}

	makeFormData(_barang) {
		console.log(_barang);
		const formData: FormData = new FormData();
		formData.append('id', _barang.id);
		formData.append('barcode', _barang.barcode);
		formData.append('name', _barang.name);
		formData.append('id_category', _barang.id_category);
		formData.append('id_brand', _barang.id_brand);
		formData.append('summary', _barang.summary);
		formData.append('description', _barang.description);
		formData.append('stock', _barang.stock);
		formData.append('price', _barang.price);
		formData.append('color', _barang.color);
		formData.append('nic', _barang.nic);
		formData.append('status', _barang.status);
		formData.append('kondisi', _barang.kondisi);
		formData.append('home', _barang.home);
		formData.append('video', _barang.video);
		formData.append('width', _barang.width);
		formData.append('height', _barang.height);
		formData.append('depth', _barang.depth);
		formData.append('weight', _barang.weight);
		// formData.append('slug', _barang.slug);
		if (this.file === null && this.files === null || !this.file && !this.files || this.file.length === 0 && this.files.length === 0) {
			formData.append('image', '');
		// tslint:disable-next-line: max-line-length
		} else if (this.file.length === 0 && this.files.length > 0 || !this.file && this.files.length > 0 || this.file === null && this.files.length > 0) {
			// console.log(this.files[0], this.files[0].name);
			formData.append('image', this.files[0], this.files[0].name);
		} else {
			// console.log(this.file[0], this.file[0].name);
			formData.append('image', this.file[0], this.file[0].name);
		}
		let files = this.files || [];
		// console.log(files);
		files.forEach(function(file) {
			return formData.append('mImage', file, file.name);
		});
		return formData;
	}

	prepareBarang1(): BarangModel {
		const controls = this.barangForm.controls;
		const _barang = new BarangModel();
		const kondisi: string = controls['kondisi'].value;
		_barang.id = this.barang.id;
		_barang.barcode = controls['barcode'].value;
		_barang.name = controls['name'].value;
		_barang.id_category = +controls['id_category'].value;
		if (this.brandHasil.length === 0) {
			_barang.id_brand = this.barang.id_brand;
		} else {
		_barang.id_brand = +this.brandHasil[0].id;
		}
		_barang.summary = controls['summary'].value;
		_barang.description = controls['description'].value;
		_barang.stock = controls['stock'].value;
		_barang.price = controls['price'].value;
		_barang.color = controls['color'].value;
		_barang.video = controls['youtube'].value;
		_barang.status = +controls['status'].value;
		_barang.nic = controls['nic'].value;
		if (kondisi === 'Regular') {
			_barang.kondisi = '2';
		} else if (kondisi === 'BestSeller') {
			_barang.kondisi = '3';
		} else {
			_barang.kondisi = '4';
		}
		_barang.home = +controls['home'].value;
		_barang.width = controls['width'].value;
		_barang.height = controls['height'].value;
		_barang.depth = controls['depth'].value;
		_barang.weight = controls['weight'].value;
		// _barang.slug = controls['slug'].value;
		// _barang.image = this.fileToUpload;
		return _barang;
	}

	makeFormData1(_barang) {
		// console.log(_barang);
		const formData: FormData = new FormData();
		formData.append('id', _barang.id);
		formData.append('barcode', _barang.barcode);
		formData.append('name', _barang.name);
		formData.append('id_category', _barang.id_category);
		formData.append('id_brand', _barang.id_brand);
		formData.append('summary', _barang.summary);
		formData.append('description', _barang.description);
		formData.append('stock', _barang.stock);
		formData.append('price', _barang.price);
		formData.append('color', _barang.color);
		formData.append('nic', _barang.nic);
		formData.append('status', _barang.status);
		formData.append('kondisi', _barang.kondisi);
		formData.append('home', _barang.home);
		formData.append('video', _barang.video);
		formData.append('width', _barang.width);
		formData.append('height', _barang.height);
		formData.append('depth', _barang.depth);
		formData.append('weight', _barang.weight);
		// formData.append('slug', _barang.slug);
		if (this.file === null && this.files === null || !this.file && !this.files || this.file.length === 0 && this.files.length === 0) {
			formData.append('image', '');
		// tslint:disable-next-line: max-line-length
		} else if (this.file.length === 0 && this.files.length > 0 || !this.file && this.files.length > 0 || this.file === null && this.files.length > 0) {
			// console.log(this.files[0], this.files[0].name);
			formData.append('image', this.files[0], this.files[0].name);
		} else {
			// console.log(this.file[0], this.file[0].name);
			formData.append('image', this.file[0], this.file[0].name);
		}
		let files = this.files || [];
		// console.log(files);
		files.forEach(function(file) {
			return formData.append('mImage', file, file.name);
		});
		return formData;
	}

	/**
	 * Update barang
	 *
	 * @param _barang: BarangModel
	 * @param withBack: boolean
	 */
	updateBarang(formData) {
		// console.log(formData);
		this.loadingSubject.next(true);

		const updateBarang: Update<BarangModel> = {
			id: formData.id,
			changes: formData
		};
		// console.log(_barang);

		this.store.dispatch(new BarangUpdated({
			partialBarang: updateBarang,
			barang: formData
		}));

			const message = `Barang successfully has been saved.`;
			this.layoutUtilsService.showActionNotification(message, MessageType.Update, 10000, true, true);
			 this.refreshBarang(false);
		return this.router.navigate(['vp-admin/catalog/product']);
	}

	updateBarang1(_barang) {
		this.loadingSubject.next(true);

		const updateBarang: Update<BarangModel> = {
			id: _barang.id,
			changes: _barang
		};
		// console.log(_barang);

		this.store.dispatch(new BarangUpdated({
			partialBarang: updateBarang,
			barang: _barang
		}));

		const message = `Barang successfully has been saved.`;
		this.layoutUtilsService.showActionNotification(message, MessageType.Update, 10000, true, true);
		this.refreshBarang(false);
	}

	/** ACTIONS */
	/**
	 * Cover Image
	 */
	setCover(item: File) {
		// console.log(item);
		if (!this.cover) {
			const data = {
				id: this.barang.id,
				image: item
			};
			const formData: FormData = new FormData();
			formData.append('image', item, item.name);
			this.barangService.setCover(formData, data.id).subscribe(
				res => {
					this.file[0] = item;
					// console.log(res);
					if (res.message === 'success') {
					this.barangService.coverParams(data.id).subscribe(
						result => {
							this.cover = result;
							// console.log(result);
						}
					);
					}
				}
			);
		} else {
			const data = {
				id: this.barang.id,
				image: item
			};
			const formData: FormData = new FormData();
			formData.append('image', item, item.name);
			this.barangService.setUPCover(formData, data.id).subscribe(
				res => {
					// console.log(res);
					this.file[0] = item;
					if (res.message === 'success') {
					this.barangService.coverParams(data.id).subscribe(
						result => {
							this.cover = result;
							// console.log(result);
						}
					);
					}
				}
			);
		}
	}

	/**
	 * Delete cover
	 */
	deleteCover() {
		// console.log('test');
		if (this.cover || this.cover !== '') {
			this.barangService.delCover(this.cover.id_product).subscribe();
		}
	}
	/**
	 * Delete Image
	 */
	deleteImage(item: File) {
		const index = this.files.indexOf(item);
		this.files.splice(index, 1);
	}

	deletevariant(id) {
		// console.log(id);
	}

	/**
	 * Cover ImageDB
	 */
	setCoverDB(id, item) {
		// console.log(item);
		if (!this.cover) {
			// console.log('1');
			const data = {
				id: id,
				image: item
			};
			// const formData: FormData = new FormData();
			// formData.append('image', item, item.name);
			this.barangService.setCoverDB(data.image, data.id).subscribe(
				res => {
					// this.file[0] = item;
					// console.log(res);
					if (res.message === 'success') {
					this.barangService.coverParams(data.id).subscribe(
						result => {
							this.cover = result;
							// console.log(result);
						}
					);
					}
				}
			);
		} else {
			// console.log('2');
			const data = {
				oldimage: this.cover.image,
				newimage: item
			};
			// console.log(data);
			// const formData: FormData = new FormData();
			// formData.append('image', item, item.name);
			this.barangService.setUPCoverDB(data, id).subscribe(
				res => {
					// console.log(res);
					// this.file[0] = item;
					if (res.text === 'Success') {
					this.barangService.coverParams(id).subscribe(
						result => {
							this.cover = result;
							// console.log(result);
						}
					);
					}
				}
			);
		}
	}

	/**
	 * Delete ImageDB
	 */
	deleteImageDB(id, item) {
		this.barangService.delImageDB(id, item).subscribe(
			res => {
				// console.log(res);
				if (res.text === 'Success Delete') {
					this.barangService.getAllImagesByID(id).subscribe(
						result => {
							this.variant = result;
							// console.log(this.variant);
						}
					);
					// console.log(this.variant$);
				}
			}
		);
	}

	/**
	 * Returns component title
	 */
	getComponentTitle() {
		let result = 'Edit product';
		if (!this.barang || !this.barang.id) {
			return result;
		}

		result = `Edit product - ${this.barang.name}`;
		return result;
	}

	/**
	 * Close alert
	 *
	 * @param $event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
		this.hasBrandErrors = false;
	}
}
