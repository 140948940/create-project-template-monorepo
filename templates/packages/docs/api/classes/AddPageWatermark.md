---
editLink: false
---

[API Documentation](../index.md) / AddPageWatermark

# Class: AddPageWatermark

## Constructors %{#Constructors}%

### constructor %{#Constructors-constructor}%

• **new AddPageWatermark**(`options`, `container`)

#### Parameters %{#Constructors-constructor-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`AddPageWatermarkOptionsType`](../index.md#addpagewatermarkoptionstype) | 水印配置 |
| `container` | `HTMLElement` | 加入水印的容器 |

## Properties %{#Properties}%

### container %{#Properties-container}%

• `Private` **container**: `HTMLElement`

加入水印的容器

___

### id %{#Properties-id}%

• `Private` **id**: `string`

生成的水印元素id

___

### options %{#Properties-options}%

• **options**: `Required`<[`AddPageWatermarkOptionsType`](../index.md#addpagewatermarkoptionstype)\>

水印配置

___

### unbind %{#Properties-unbind}%

• **unbind**: ``null`` \| () => `void` = `null`

去除container上的水印

___

### normalAddPageWatermarkOption %{#Properties-normalAddPageWatermarkOption}%

▪ `Static` **normalAddPageWatermarkOption**: `Required`<[`AddPageWatermarkOptionsType`](../index.md#addpagewatermarkoptionstype)\>

水印默认配置

___

### watermarkId %{#Properties-watermarkId}%

▪ `Static` **watermarkId**: `number` = `0`

## Methods %{#Methods}%

### createObserver %{#Methods-createObserver}%

▸ `Private` **createObserver**(`textArr`): `MutationObserver`

#### Parameters %{#Methods-createObserver-Parameters}%

| Name | Type |
| :------ | :------ |
| `textArr` | `string` \| `string`[] |

#### Returns %{#Methods-createObserver-Returns}%

`MutationObserver`

___

### set %{#Methods-set}%

▸ **set**(`textArr`): ``null`` \| () => `void`

#### Parameters %{#Methods-set-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `textArr` | `string` \| `string`[] | 水印的文字 |

#### Returns %{#Methods-set-Returns}%

``null`` \| () => `void`

unbind方法

___

### setWatermark %{#Methods-setWatermark}%

▸ `Private` **setWatermark**(`textArr`): `string`

#### Parameters %{#Methods-setWatermark-Parameters}%

| Name | Type |
| :------ | :------ |
| `textArr` | `string` \| `string`[] |

#### Returns %{#Methods-setWatermark-Returns}%

`string`
