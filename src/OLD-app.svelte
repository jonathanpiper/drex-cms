<!-- {#if RMContent.contentType != 'media'}
    <ol>
        {#each RMContent.content as Content (Content)}
            <li>
                <div class="item-row">
                    <span
                        class="list"
                        on:click={() => {
                            getItem(RMContent.contentType, Content);
                        }}>{Content}</span
                    >
                    {#if RMContent.content.indexOf(Content) != 0}
                        <div
                            on:click={() => {
                                moveRailMapItemUp(Content, RMContent.contentType);
                            }}
                        >
                            <ArrowUp />
                        </div>
                    {:else}
                        <div class="blank-icon" />
                    {/if}
                    {#if RMContent.content.indexOf(Content) != RMContent.content.length - 1}
                        <div
                            on:click={() => {
                                moveRailMapItemDown(Content, RMContent.contentType);
                            }}
                        >
                            <ArrowDown />
                        </div>
                    {:else}
                        <div class="blank-icon" />
                    {/if}
                    <div
                        class="delete-button"
                        on:click={() => {
                            removeRailMapItem(Content, RMContent.contentType);
                        }}
                    >
                        <MinusCircle color="red" />
                    </div>
                </div>
            </li>
        {/each}
        <div class="add-button">
            <p
                on:click={() => {
                    initializeNewItem(RMContent.contentType);
                }}
            >
                <PlusCircle color="green" />
            </p>
        </div>
    </ol>
{:else}
    {#each RMContent.content as Category, Index}
        <h5>{Category.name}</h5>
        <ol>
            {#each Category.content as Content (Content)}
                <li>
                    <div class="item-row">
                        <span
                            class="list"
                            on:click={() => {
                                getItem('media', Content, Category.name);
                            }}
                        >
                            {Content}
                        </span>
                        {#if Category.content.indexOf(Content) != 0}
                            <div
                                on:click={() => {
                                    moveRailMapItemUp(Content, RMContent.contentType, Category.name);
                                }}
                            >
                                <ArrowUp />
                            </div>
                        {:else}
                            <div class="blank-icon" />
                        {/if}
                        {#if Category.content.indexOf(Content) != Category.content.length - 1}
                            <div
                                on:click={() => {
                                    moveRailMapItemDown(Content, RMContent.contentType, Category.name);
                                }}
                            >
                                <ArrowDown />
                            </div>
                        {:else}
                            <div class="blank-icon" />
                        {/if}
                        <div class="delete-button">
                            <MinusCircle color="red" />
                        </div>
                    </div>
                </li>
            {/each}
            <p
                on:click={() => {
                    initializeNewItem(Category.name);
                }}
            >
                <PlusCircle color="green" />
            </p>
        </ol>
    {/each}
{/if} -->