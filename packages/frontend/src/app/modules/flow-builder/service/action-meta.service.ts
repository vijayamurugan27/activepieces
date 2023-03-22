import { Injectable } from '@angular/core';
import { FlowItemDetails } from '../page/flow-builder/flow-right-sidebar/step-type-sidebar/step-type-item/flow-item-details';
import {
  ActionType,
  ApEdition,
  PieceMetadata,
  PieceMetadataSummary,
  PieceOptionRequest,
  TriggerBase,
  TriggerStrategy,
  TriggerType,
} from '@activepieces/shared';
import { HttpClient } from '@angular/common/http';
import { PieceProperty } from '../../common/components/configs-form/connector-action-or-config';
import { Observable, shareReplay, map, forkJoin } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FlagService } from '../../common/service/flag.service';

type TriggersMetadata = Record<string, TriggerBase>;

@Injectable({
  providedIn: 'root',
})
export class ActionMetaService {
  private piecesManifest$ = this.http
    .get<PieceMetadataSummary[]>(`${environment.apiUrl}/pieces`)
    .pipe(shareReplay(1));

  private piecesCache = new Map<string, Observable<PieceMetadata>>();

  private edition$ = this.flagsService.getEdition();

  public coreFlowItemsDetails: FlowItemDetails[] = [
    {
      type: ActionType.CODE,
      name: 'Code',
      description: 'Powerful nodejs & typescript code with npm',
      logoUrl: '/assets/img/custom/piece/code.svg',
    },
    {
      type: ActionType.BRANCH,
      name: 'Branch',
      description: 'Decide what happens based on an if condition result',
      logoUrl: '/assets/img/custom/piece/branch.svg',
    },
    {
      type: ActionType.LOOP_ON_ITEMS,
      name: 'Loop',
      description: 'Loop on a list of items',
      logoUrl: '/assets/img/custom/piece/loop.svg',
    },
  ];

  public triggerItemsDetails = [
    {
      type: TriggerType.SCHEDULE,
      name: 'Schedule',
      description: 'Trigger flow with fixed schedule.',
      logoUrl: '/assets/img/custom/piece/schedule.svg',
    },
    {
      type: TriggerType.WEBHOOK,
      name: 'Webhook',
      description: 'Trigger flow by calling a unique web url',
      logoUrl: '/assets/img/custom/piece/webhook.svg',
    },
    {
      type: TriggerType.EMPTY,
      name: 'Trigger',
      description: 'Choose a trigger',
      logoUrl: '/assets/img/custom/piece/empty-trigger.svg',
    },
  ];

  constructor(private http: HttpClient, private flagsService: FlagService) {}

  private getCacheKey(pieceName: string, pieceVersion: string): string {
    return `${pieceName}-${pieceVersion}`;
  }

  private filterAppWebhooks(
    triggersMap: TriggersMetadata,
    edition: ApEdition
  ): TriggersMetadata {
    if (edition === ApEdition.ENTERPRISE) {
      return triggersMap;
    }

    const triggersList = Object.entries(triggersMap);

    const filteredTriggersList = triggersList.filter(
      ([, trigger]) => trigger.type !== TriggerStrategy.APP_WEBHOOK
    );

    return Object.fromEntries(filteredTriggersList);
  }

  private fetchPieceMetadata(
    pieceName: string,
    pieceVersion: string
  ): Observable<PieceMetadata> {
    return this.http.get<PieceMetadata>(
      `${environment.apiUrl}/pieces/${pieceName}?version=${pieceVersion}`
    );
  }

  getPiecesManifest(): Observable<PieceMetadataSummary[]> {
    return this.piecesManifest$;
  }

  getPieceMetadata(
    pieceName: string,
    pieceVersion: string
  ): Observable<PieceMetadata> {
    const cacheKey = this.getCacheKey(pieceName, pieceVersion);

    if (this.piecesCache.has(cacheKey)) {
      return this.piecesCache.get(cacheKey)!;
    }

    const pieceMetadata$ = forkJoin({
      pieceMetadata: this.fetchPieceMetadata(pieceName, pieceVersion),
      edition: this.edition$,
    }).pipe(
      map(({ pieceMetadata, edition }) => {
        pieceMetadata.triggers = this.filterAppWebhooks(
          pieceMetadata.triggers,
          edition
        );
        return pieceMetadata;
      }),
      shareReplay(1)
    );

    this.piecesCache.set(cacheKey, pieceMetadata$);
    return this.piecesCache.get(cacheKey)!;
  }

  getPieceActionConfigOptions<
    T extends DropdownState<any> | Record<string, PieceProperty>
  >(req: PieceOptionRequest, pieceName: string) {
    return this.http.post<T>(
      environment.apiUrl + `/pieces/${pieceName}/options`,
      req
    );
  }
}

export type DropdownState<T> = {
  disabled?: boolean;
  placeholder?: string;
  options: DropdownOption<T>[];
};

export type DropdownOption<T> = {
  label: string;
  value: T;
};
