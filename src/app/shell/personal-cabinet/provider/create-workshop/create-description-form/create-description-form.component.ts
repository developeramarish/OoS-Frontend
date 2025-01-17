import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ENTER } from '@angular/cdk/keycodes';
import { CropperConfigurationConstants } from 'shared/constants/constants';
import { Tag } from 'shared/models/tag.model';
import { MUST_CONTAIN_LETTERS } from 'shared/constants/regex-constants';
import { ValidationConstants } from 'shared/constants/validation';
import { Provider } from 'shared/models/provider.model';
import { Workshop, WorkshopDescriptionItem } from 'shared/models/workshop.model';
import { AgeComposition, Coverage, EducationalShift, FormOfLearning, SpecialNeedsType, WorkshopType } from 'shared/enum/workshop';
import {
  AgeCompositionEnum,
  CoverageEnum,
  EducationalShiftEnum,
  FormOfLearningEnum,
  SpecialNeedsTypeEnum,
  WorkshopTypeEnum
} from 'shared/enum/enumUA/workshop';
import { Util } from 'shared/utils/utils';
import { TagService } from 'shared/services/workshops/tag-workshop/tag-workshop.service';
import { Direction } from '../../../../../shared/models/category.model';

@Component({
  selector: 'app-create-description-form',
  templateUrl: './create-description-form.component.html',
  styleUrls: ['./create-description-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateDescriptionFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() public workshop: Workshop;
  @Input() public isImagesFeature: boolean;
  @Input() public provider: Provider;

  @Output() public passDescriptionFormGroup = new EventEmitter();

  @ViewChild('keyWordsInput') public keyWordsInputElement: ElementRef;

  public readonly validationConstants = ValidationConstants;
  public readonly FormOfLearning = FormOfLearning;
  public readonly FormOfLearningEnum = FormOfLearningEnum;
  public readonly Util = Util;
  public readonly cropperConfig = {
    cropperMinWidth: CropperConfigurationConstants.cropperMinWidth,
    cropperMaxWidth: CropperConfigurationConstants.cropperMaxWidth,
    cropperMinHeight: CropperConfigurationConstants.cropperMinHeight,
    cropperMaxHeight: CropperConfigurationConstants.cropperMaxHeight,
    cropperAspectRatio: CropperConfigurationConstants.galleryImagesCropperAspectRatio,
    croppedHeight: CropperConfigurationConstants.croppedGalleryImage.height,
    croppedFormat: CropperConfigurationConstants.croppedFormat,
    croppedQuality: CropperConfigurationConstants.croppedQuality
  };

  // Variables for selects
  public readonly SpecialNeedsTypeEnum = SpecialNeedsTypeEnum;
  public readonly SpecialNeedsType = SpecialNeedsType;
  public readonly EducationalShiftEnum = EducationalShiftEnum;
  public readonly EducationalShift = EducationalShift;
  public readonly AgeCompositionEnum = AgeCompositionEnum;
  public readonly AgeComposition = AgeComposition;
  public readonly CoverageEnum = CoverageEnum;
  public readonly Coverage = Coverage;
  public readonly WorkshopTypeEnum = WorkshopTypeEnum;
  public readonly WorkshopType = WorkshopType;

  public DescriptionFormGroup: FormGroup;
  public EditFormGroup: FormGroup;
  public SectionItemsFormArray = new FormArray([]);
  public keyWordsCtrl: FormControl = new FormControl('', Validators.required);

  public keyWords: string[] = [];
  public tags: Tag[] = [];

  public disabilityOptionRadioBtn: FormControl = new FormControl(false);

  public competitiveSelectionRadioBtn: FormControl = new FormControl(false);
  public separatorKeysCodes = [ENTER];

  public tagsControl: FormControl = new FormControl([]);

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly tagService: TagService
  ) {
    this.DescriptionFormGroup = this.formBuilder.group({
      imageFiles: new FormControl(''),
      imageIds: new FormControl(''),
      disabilityOptionsDesc: new FormControl({ value: '', disabled: true }, [
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256)
      ]),
      keyWords: new FormControl(null),
      workshopDescriptionItems: this.SectionItemsFormArray,
      competitiveSelection: new FormControl(false),
      competitiveSelectionDescription: null,
      tagIds: new FormControl([]),
      shortStay: new FormControl(false),
      isSelfFinanced: new FormControl(false),
      enrollmentProcedureDescription: new FormControl('', [
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_500)
      ]),
      isSpecial: new FormControl(false),
      isInclusive: new FormControl(false),
      specialNeedsType: new FormControl(this.SpecialNeedsType.None),
      areThereBenefits: new FormControl(false),
      preferentialTermsOfParticipation: new FormControl(''),
      educationalShift: new FormControl(this.EducationalShift.First, Validators.required),
      ageComposition: new FormControl(this.AgeComposition.SameAge, Validators.required),
      coverage: new FormControl(this.Coverage.School),
      workshopType: new FormControl(this.WorkshopType.None, Validators.required)
    });
  }

  public compareItems(item1: Direction, item2: Direction): boolean {
    return item1.id === item2.id;
  }

  public ngOnInit(): void {
    this.onDisabilityOptionCtrlInit();

    this.tagsControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((selectedTags: Tag[]) => {
      this.updateTagIds(selectedTags || []);
    });

    if (this.workshop) {
      this.activateEditMode();
    } else {
      this.onAddForm();
    }

    this.tagService
      .getTags()
      .pipe(take(1))
      .subscribe((tags) => {
        this.tags = tags;
      });

    this.passDescriptionFormGroup.emit(this.DescriptionFormGroup);
    this.keyWordsListener();

    this.onCompetitiveSelectionInit();
  }

  public ngAfterViewInit(): void {
    this.updateKeywordsInputState();
  }

  /**
   * This method remove already added keywords from the list of keywords
   * @param word
   */
  public onRemoveKeyWord(word: string): void {
    if (this.keyWords.includes(word)) {
      this.keyWords = this.keyWords.filter((kw) => kw !== word);
      this.updateKeywordsInputState();
      if (this.keyWords.length) {
        this.DescriptionFormGroup.get('keyWords').setValue(this.keyWords);
      } else {
        this.DescriptionFormGroup.get('keyWords').reset();
      }
    }
  }

  public onRemoveItem(tag: Tag): void {
    const currentTags = this.tagsControl.value || [];
    const updatedTags = currentTags.filter((t) => t.id !== tag.id);
    this.tagsControl.setValue(updatedTags);
    this.updateTagIds(updatedTags);
  }

  public onKeyWordsInput(isEditMode: boolean = true): void {
    this.DescriptionFormGroup.get('keyWords').markAsTouched();
    const inputKeyWord = this.keyWordsCtrl.value?.trim().toLowerCase();
    if (inputKeyWord && !this.keyWords.includes(inputKeyWord)) {
      if (this.keyWords.length < this.validationConstants.MAX_KEYWORDS_LENGTH) {
        this.keyWords = [...this.keyWords, inputKeyWord];
        this.updateKeywordsInputState();
        this.DescriptionFormGroup.get('keyWords').setValue(this.keyWords, { emitEvent: isEditMode });
        this.keyWordsCtrl.setValue('');
      }
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to the FormGroup
   */
  public onDisabilityOptionCtrlInit(): void {
    const setAction = (action: string): void => this.DescriptionFormGroup.get('disabilityOptionsDesc')[action]();
    this.disabilityOptionRadioBtn.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((isDisabilityOptionsDesc: boolean) => {
      if (isDisabilityOptionsDesc) {
        setAction('enable');
      } else {
        setAction('disable');
        this.DescriptionFormGroup.get('disabilityOptionsDesc').reset();
      }
      this.markFormAsDirtyOnUserInteraction();
    });
  }

  /**
   * This method listens for changes in the 'keyWords' control and marks
   * the form as 'dirty' whenever there are changes in the key words.
   */
  public keyWordsListener(): void {
    this.DescriptionFormGroup.get('keyWords')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.markFormAsDirtyOnUserInteraction();
      });
  }

  /**
   * This method puts keyWordsInput field in focus
   */
  public setFocus(): void {
    this.keyWordsInputElement.nativeElement.focus();
  }

  /**
   * This method creates new FormGroup adds new FormGroup to the FormArray
   */
  public onAddForm(): void {
    if (this.DescriptionFormGroup.get('workshopDescriptionItems')) {
      (this.DescriptionFormGroup.get('workshopDescriptionItems') as FormArray).push(this.newForm());
    }
  }

  /**
   * This method delete FormGroup from the FormArray by index
   * @param index
   */
  public onDeleteForm(index: number): void {
    this.SectionItemsFormArray.removeAt(index);
    this.markFormAsDirtyOnUserInteraction();
  }

  /**
   * This method fills inputs with information of edited workshop
   */
  public activateEditMode(): void {
    this.DescriptionFormGroup.patchValue(this.workshop, { emitEvent: false });

    this.workshop.keywords.forEach((keyWord: string) => {
      this.keyWordsCtrl.setValue(keyWord);
      this.onKeyWordsInput(false);
    });

    if (this.workshop.withDisabilityOptions) {
      this.disabilityOptionRadioBtn.setValue(this.workshop.withDisabilityOptions, { emitEvent: false });
      this.DescriptionFormGroup.get('disabilityOptionsDesc').enable({ emitEvent: false });
    }

    if (this.workshop.workshopDescriptionItems?.length) {
      this.workshop.workshopDescriptionItems.forEach((item: WorkshopDescriptionItem) => {
        const itemFrom = this.newForm(item);
        this.SectionItemsFormArray.controls.push(itemFrom);
        // eslint-disable-next-line dot-notation, @typescript-eslint/dot-notation
        this.SectionItemsFormArray['_registerControl'](itemFrom);
      });
    } else {
      this.onAddForm();
    }

    if (this.workshop.competitiveSelection) {
      this.DescriptionFormGroup.addControl(
        'competitiveSelectionDescription',
        new FormControl(this.workshop.competitiveSelectionDescription || '', Validators.required)
      );
    }

    if (this.workshop?.tagIds?.length) {
      const selectedTags = this.tags.filter((tag) => this.workshop.tagIds.includes(tag.id));
      this.tagsControl.setValue(selectedTags);
    }

    this.competitiveSelectionRadioBtn.setValue(this.workshop.competitiveSelection);
  }

  private onCompetitiveSelectionInit(): void {
    this.competitiveSelectionRadioBtn.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: boolean) => {
      this.DescriptionFormGroup.get('competitiveSelection').setValue(value);
      if (!value) {
        this.DescriptionFormGroup.get('competitiveSelectionDescription').reset();
      }
    });
  }

  /**
   * This method creates new FormGroup
   */
  private newForm(item?: WorkshopDescriptionItem): FormGroup {
    this.EditFormGroup = this.formBuilder.group({
      sectionName: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_100),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ])
    });

    if (this.workshop) {
      this.EditFormGroup.addControl('workshopId', this.formBuilder.control(this.workshop.id));
    }

    if (item) {
      this.EditFormGroup.patchValue(item, { emitEvent: false });
    }

    return this.EditFormGroup;
  }

  /**
   * This method makes DescriptionFormGroup dirty
   */
  private markFormAsDirtyOnUserInteraction(): void {
    if (!this.DescriptionFormGroup.dirty) {
      this.DescriptionFormGroup.markAsDirty({ onlySelf: true });
    }
  }

  private updateTagIds(tags: Tag[]): void {
    const tagIds = tags.map((tag) => tag.id);
    const stringifiedTagIds = JSON.stringify(tagIds);
    this.DescriptionFormGroup.get('tagIds')?.setValue(stringifiedTagIds);
  }

  private updateKeywordsInputState(): void {
    if (this.keyWords.length >= this.validationConstants.MAX_KEYWORDS_LENGTH) {
      this.keyWordsCtrl.disable({ emitEvent: false });
    } else {
      this.keyWordsCtrl.enable({ emitEvent: false });
    }
  }
}
